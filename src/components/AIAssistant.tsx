import { useState } from "react";
// import { useRef } from "react";
// import Send from "../assets/send.png";
import { X } from "lucide-react";

const AIAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // const [messages, setMessages] = useState([
  //   { sender: "ai", text: "Hello! How can I assist you today? 😊" },
  // ]);
  // const [input, setInput] = useState("");
  // const chatEndRef = useRef(null);

  // const sendMessage = () => {
  //   if (!input.trim()) return;
  //   setMessages([...messages, { sender: "user", text: input }]);
  //   setInput("");

  //   // TODO: AI Response Logic
  // };

  return (
    <div className="mb-8 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-6 border border-primary/20 shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center shadow-md">
          <span className="text-3xl">🤖</span>
        </div>

        <div className="flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-primary">Hostrix Assistant</h2>
          <p className="text-muted-foreground text-sm">
            Need help with your deployments? I'm here! 🚀
          </p>
        </div>

        <button
          className="ml-auto px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg shadow-sm transition-all hover:bg-primary/90 hover:scale-101 active:scale-100 flex items-center gap-2"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? (
            <>
              <X className="w-4 h-4" />
              Close
            </>
          ) : (
            "💬 Chat with Assistant"
          )}
        </button>
      </div>

      {/* {isChatOpen && (
        <div className="p-4 bg-gray-50 rounded-xl mt-4">
          <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide p-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-gray-100 rounded-lg border transition-all flex items-center justify-center hover:bg-primary/90 active:scale-95"
            >
              <img src={Send} alt="Send" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )} */}

      {isChatOpen && (
        <div className="p-6 bg-white border border-gray-200 rounded-xl mt-4 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
              🤖
            </div>
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-md text-left text-sm shadow-inner">
              <span className="font-medium">Hi there!</span>
              <br />
              I'm still learning to assist you. This feature is{" "}
              <span className="font-semibold text-indigo-600">
                coming very soon
              </span>
              ! 🚀
              <div className="flex items-center text-xs text-gray-500 italic animate-pulse mt-2">
                Preparing assistant magic...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
