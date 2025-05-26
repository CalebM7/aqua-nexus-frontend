import { useState, useRef } from "react";

const FAQS = [
  {
    q: "How do I post a project?",
    a: "Sign up as a user, log in, and click 'Post a Project' on your dashboard. Fill in the project details and submit."
  },
  {
    q: "How are providers vetted?",
    a: "All providers go through a verification process, including certification checks and reviews from previous clients."
  },
  {
    q: "Is payment secure?",
    a: "Yes, all payments are handled securely through our platform, ensuring both client and provider protection."
  },
  {
    q: "Can I become a provider?",
    a: "Yes! Sign up as a provider, complete your profile, and start bidding on projects."
  },
  {
    q: "How does AquaNexus work?",
    a: "Post your project, receive and compare bids from certified providers, hire the best fit, and manage your project securely through AquaNexus."
  }
];

const GEMINI_API_KEY = "AIzaSyD7VnW0OJCUe8mfclciBR--tWFv__pUGRo";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm AquaBot. Ask me anything about AquaNexus, posting projects, providers, or payments." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Try to answer from FAQ first
  const faqAnswer = (question) => {
    const q = question.toLowerCase();
    for (const faq of FAQS) {
      if (q.includes(faq.q.toLowerCase().slice(0, 10))) return faq.a;
      if (faq.q.toLowerCase().includes(q)) return faq.a;
    }
    return null;
  };

  const sendToGemini = async (question) => {
    // Use Gemini API for open-ended questions
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;
    const prompt = `You are AquaBot, a helpful assistant for the AquaNexus web application. Answer user questions about posting projects, providers, payments, and AquaNexus features. If the question is about AquaNexus, answer clearly and concisely. If you don't know, say "I'm not sure, but you can contact support@aquanexus.ke".\n\nUser: ${question}\nAquaBot:`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
      return "Sorry, I couldn't get an answer right now.";
    } catch {
      return "Sorry, I couldn't connect to the AI service.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    // Try FAQ first
    const faq = faqAnswer(input);
    let botMsg;
    if (faq) {
      botMsg = faq;
    } else {
      botMsg = await sendToGemini(input);
    }
    setMessages((msgs) => [...msgs, { from: "bot", text: botMsg }]);
    setLoading(false);
    scrollToBottom();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-aqua-blue text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-aqua-teal transition"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
      >
        <i className="fas fa-comments"></i>
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-xs bg-white rounded-xl shadow-2xl flex flex-col border border-aqua-blue">
          <div className="flex items-center justify-between px-4 py-2 bg-aqua-blue rounded-t-xl">
            <span className="font-bold text-white">AquaBot</span>
            <button
              className="text-white text-lg"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2" style={{ maxHeight: 320 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                    msg.from === "user"
                      ? "bg-aqua-blue text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
          <div className="p-2 border-t flex gap-2">
            <textarea
              className="flex-1 border rounded px-2 py-1 text-sm resize-none focus:ring-2 focus:ring-aqua-blue"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AquaBot..."
              disabled={loading}
              style={{ minHeight: 36, maxHeight: 60 }}
            />
            <button
              className="bg-aqua-blue text-white rounded px-3 py-1 font-semibold disabled:opacity-60"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
