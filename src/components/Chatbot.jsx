import { useState, useRef, useEffect } from 'react';

const BACKEND_SEARCH_URL = 'http://localhost:5000/api/search';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hi! I'm AquaBot. Ask me anything about AquaNexus, posting projects, providers, or payments.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqList, setFaqList] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch FAQs from backend on mount
    fetch('http://localhost:5000/api/faqs')
      .then((res) => res.json())
      .then((data) => setFaqList(data))
      .catch(() => setFaqList([]));
  }, []);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatEndRef.current)
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Improved FAQ answer function using dynamic FAQ list
  const faqAnswer = (question) => {
    const q = question.toLowerCase();
    for (const faq of faqList) {
      // Match if the user's question contains a significant part of the FAQ question, or vice versa
      if (
        q.includes(faq.q.toLowerCase().slice(0, 10)) ||
        faq.q.toLowerCase().includes(q) ||
        q.includes(faq.q.toLowerCase())
      ) {
        return faq.a;
      }
    }
    return null;
  };

  const fetchBackendContext = async (query) => {
    try {
      const res = await fetch(
        `${BACKEND_SEARCH_URL}?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const sendToGemini = async (question, context = null) => {
    let contextText = '';
    if (context) {
      if (context.faqs?.length) {
        contextText += 'Relevant FAQs:\n';
        context.faqs.forEach((faq) => {
          contextText += `Q: ${faq.q}\nA: ${faq.a}\n`;
        });
      }
      if (context.providers?.length) {
        contextText += '\nRelevant Providers:\n';
        context.providers.forEach((p) => {
          contextText += `Name: ${p.name}, Service: ${p.service_type}, Rating: ${p.rating}\n`;
        });
        contextText +=
          "\nBased on the above providers, answer the user's question if relevant.\n";
      }
      if (context.projects?.length) {
        contextText += '\nRelevant Projects:\n';
        context.projects.forEach((p) => {
          contextText += `Title: ${p.title}, Service: ${p.service_type}, Budget: ${p.budget}\n`;
        });
      }
    }
    const prompt = `${contextText}\nUser: ${question}\nAquaBot:`;
    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
      GEMINI_API_KEY;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      const data = await res.json();
      console.log('Gemini API response:', data); // <-- Add this line
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
    const userMsg = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    // Try FAQ first (case-insensitive, partial match)
    const faq = faqAnswer(input);
    let botMsg;
    if (faq) {
      botMsg = faq;
    } else {
      // Only call Gemini if FAQ not found
      const context = await fetchBackendContext(input);
      botMsg = await sendToGemini(input, context);
    }
    setMessages((msgs) => [...msgs, { from: 'bot', text: botMsg }]);
    setLoading(false);
    scrollToBottom();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-aqua-blue text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-aqua-teal transition"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
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
          <div
            className="flex-1 overflow-y-auto px-4 py-2"
            style={{ maxHeight: 320 }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 flex ${
                  msg.from === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                    msg.from === 'user'
                      ? 'bg-aqua-blue text-white'
                      : 'bg-gray-100 text-gray-800'
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
