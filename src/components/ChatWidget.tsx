import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Leaf, MessageCircle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDisease } from "@/lib/diseaseContext";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cropguard.chat.messages.v1";

const QUICK_REPLIES = [
  { label: "Diagnose from symptoms", text: "How do I diagnose crop diseases from visible symptoms?" },
  { label: "Pesticide recommendation", text: "Which pesticide should I use and what is the proper dosage?" },
  { label: "Prevention tips", text: "What are the best prevention tips for common crop diseases?" },
  { label: "Soil health", text: "How can I improve my soil health for better crop yield?" },
];

const DIAGNOSIS_QUICK_REPLIES = [
  { label: "Disease overview", text: "Give me a quick overview of this disease." },
  { label: "Organic treatment", text: "What organic treatment options do I have?" },
  { label: "Chemical treatment", text: "Recommend chemical treatments with dosage and timing." },
  { label: "Recovery timeline", text: "How long will recovery take and what should I monitor?" },
  { label: "Weather precautions", text: "What weather-related precautions should I take right now?" },
];

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [initialMessages] = useState<UIMessage[]>(() => loadMessages());
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { current, registerChatOpener, getDiagnosisForChat } = useDisease();

  const transportRef = useRef(
    new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages, body }) => ({
        body: {
          ...body,
          messages,
          diagnosis: getDiagnosisForChat(),
        },
      }),
    }),
  );

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "cropguard-chat",
    messages: initialMessages,
    transport: transportRef.current,
  });

  // Register the opener so other components can open the chat
  useEffect(() => {
    return registerChatOpener(() => setOpen(true));
  }, [registerChatOpener]);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Keep textarea focused
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
    }, 80);
    return () => clearTimeout(t);
  }, [open, status]);

  const handleSubmit = async (msg: PromptInputMessage) => {
    const text = msg.text?.trim();
    if (!text) return;
    await sendMessage({ text });
  };

  const handleQuickReply = (text: string) => {
    sendMessage({ text });
  };

  const clearChat = () => {
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const isLoading = status === "submitted" || status === "streaming";

  const diagnosisLabel = current?.prediction
    ? `${current.prediction.plantName ? current.prediction.plantName + " — " : ""}${current.prediction.disease}`
    : null;

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]",
          "transition-transform hover:scale-105 active:scale-95",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className={cn(
            "fixed bottom-24 right-5 z-50 flex w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden",
            "h-[min(560px,calc(100vh-8rem))] rounded-2xl border border-border bg-background shadow-2xl",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Leaf className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none text-foreground">CropGuard Assistant</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {diagnosisLabel ? `Context: ${diagnosisLabel}` : "Farming & crop disease help"}
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={clearChat}
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Messages */}
          <Conversation className="flex-1">
            <ConversationContent className="px-3 py-3">
              {current && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
                  <p className="font-medium text-foreground">
                    Latest scan loaded: {current.prediction.disease}
                    {current.prediction.plantName ? ` (${current.prediction.plantName})` : ""}
                  </p>
                  <p className="text-muted-foreground">
                    {current.prediction.confidence}% confidence · {current.prediction.severity}
                  </p>
                </div>
              )}
              {messages.length === 0 ? (
                <>
                  <ConversationEmptyState
                    icon={<Leaf className="h-8 w-8 text-primary" />}
                    title={
                      current
                        ? "Ask about your latest scan"
                        : "Ask me anything about your crops"
                    }
                    description={
                      current
                        ? "I already know your diagnosis — ask for treatment, prevention, or recovery advice."
                        : "Diseases, pesticides, soil, irrigation — in English or Marathi."
                    }
                  />
                  <div className="flex flex-wrap gap-2 px-2 pb-2 pt-1">
                    {(current ? DIAGNOSIS_QUICK_REPLIES : QUICK_REPLIES).map((reply) => (
                      <button
                        key={reply.label}
                        type="button"
                        onClick={() => handleQuickReply(reply.text)}
                        className={cn(
                          "rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground",
                          "transition-colors hover:bg-muted hover:text-primary",
                          "disabled:pointer-events-none disabled:opacity-50",
                        )}
                        disabled={isLoading}
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                messages.map((m) => (
                  <Message from={m.role} key={m.id}>
                    <MessageContent
                      className={cn(
                        m.role === "assistant" && "bg-transparent p-0 text-foreground",
                      )}
                    >
                      {m.parts.map((part, i) => {
                        if (part.type === "text") {
                          return m.role === "assistant" ? (
                            <MessageResponse key={i}>{part.text}</MessageResponse>
                          ) : (
                            <span key={i}>{part.text}</span>
                          );
                        }
                        return null;
                      })}
                    </MessageContent>
                  </Message>
                ))
              )}
              {status === "submitted" && (
                <Message from="assistant">
                  <MessageContent className="bg-transparent p-0">
                    <Shimmer>Thinking…</Shimmer>
                  </MessageContent>
                </Message>
              )}
              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error.message || "Something went wrong. Please try again."}
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Composer */}
          <div className="border-t border-border bg-background p-2">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                placeholder="Ask about a crop disease, pesticide, soil…"
                disabled={isLoading}
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={isLoading} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}
