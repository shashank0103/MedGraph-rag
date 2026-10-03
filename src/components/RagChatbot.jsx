import { useState } from "react";
import { Bot, ChevronDown, Send, Sparkles, X } from "lucide-react";

import { answerClinicalQuestion } from "../Data/clinicalStore";
import { getCurrentUser } from "../Data/auth";

export default function RagChatbot() {
  const user = getCurrentUser();
  const starterMessage = {
    role: "assistant",
    text:
      user.role === "patient"
        ? `Hi ${user.name}. I can help you review your recorded condition, symptoms, medications, reports, or knowledge graph.`
        : "Ask about a patient, condition, symptom, medication, or priority. I will retrieve matching facts from the clinical knowledge graph.",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([starterMessage]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    const response = answerClinicalQuestion(trimmedQuestion, user.role === "patient" ? [user.patient] : undefined);
    setMessages((previous) => [
      ...previous,
      { role: "user", text: trimmedQuestion },
      {
        role: "assistant",
        text: response.answer,
        sources: response.sources,
      },
    ]);
    setQuestion("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen && (
        <section className="mb-3 flex h-[min(620px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-semibold">Clinical RAG assistant</p>
                <p className="text-xs text-cyan-100">{user.role === "patient" ? "Your health record only" : "Knowledge graph retrieval active"}</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant" className="rounded-xl p-2 hover:bg-white/15">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-8" : "mr-5"}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-teal-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                  {message.text}
                </div>
                {message.sources?.length > 0 && (
                  <p className="mt-1 px-2 text-[11px] text-slate-400">
                    Retrieved from: {message.sources.map((source) => source.name).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-100">
              <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask the clinical graph..." className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none" />
              <button type="submit" aria-label="Send question" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition hover:bg-teal-700">
                <Send size={16} />
              </button>
            </div>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Minimize clinical assistant" : "Open clinical assistant"} className="ml-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-xl shadow-teal-600/30 transition hover:-translate-y-0.5 hover:bg-teal-700">
        {isOpen ? <ChevronDown size={22} /> : <Sparkles size={22} />}
      </button>
    </div>
  );
}