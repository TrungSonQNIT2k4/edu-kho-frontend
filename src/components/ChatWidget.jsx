// components/ChatWidget.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function ChatWidget() {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const socketRef = useRef(null);
  const senderIdRef = useRef(null);
  const chatContainerRef = useRef(null); // THAM CHIẾU ĐẾN KHUNG CHAT
  const chatEndRef = useRef(null); // ĐIỂM CUỐI

  // TỰ ĐỘNG CUỘN XUỐNG KHI CÓ TIN NHẮN MỚI
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    console.log("Kết nối Socket.IO...");

    socketRef.current = io("http://localhost:5005", {
      reconnection: true,
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      const socketId = socketRef.current.id;
      console.log("Kết nối thành công! ID:", socketId);
      senderIdRef.current = socketId;

      socketRef.current.emit("session_request", { session_id: socketId });
      setIsConnected(true);
      setIsSessionReady(false);
    });

    socketRef.current.on("session_confirm", (data) => {
      console.log("SESSION SẴN SÀNG:", data);
      setIsSessionReady(true);
    });

    socketRef.current.on("bot_uttered", (data) => {
      console.log("BOT TRẢ LỜI:", data);
      if (data?.text) {
        setChatHistory((prev) => [...prev, { sender: "bot", text: data.text }]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !isSessionReady || !senderIdRef.current) return;

    console.log("GỬI TIN NHẮN:", message);
    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);

    socketRef.current.emit("user_uttered", {
      message: message,
      session_id: senderIdRef.current,
    });

    setMessage("");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        Chatbot EduKho
        <span
          style={{
            fontSize: "14px",
            color: isConnected ? (isSessionReady ? "green" : "orange") : "red",
          }}
        >
          {isConnected
            ? isSessionReady
              ? "Online"
              : "Đang khởi tạo..."
            : "Offline"}
        </span>
      </h3>

      {/* KHUNG CHAT CÓ REF */}
      <div
        ref={chatContainerRef}
        style={{
          height: "400px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
          scrollBehavior: "smooth",
        }}
      >
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "bot" ? "left" : "right",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: msg.sender === "bot" ? "#eee" : "#007bff",
                color: msg.sender === "bot" ? "#000" : "#fff",
                padding: "10px 15px",
                borderRadius: "15px",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}

        {/* ĐIỂM CUỐI ĐỂ CUỘN */}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isSessionReady ? "Gõ tin nhắn..." : "Đang kết nối..."}
          disabled={!isSessionReady}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          disabled={!isSessionReady}
          style={{
            padding: "10px 20px",
            background: isSessionReady ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
