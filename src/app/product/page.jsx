"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Menu,
  Home,
  Package,
  Users,
  Download,
  Upload,
  Settings,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

// ChatWidget Component
function ChatWidget({ onClose }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const socketRef = useRef(null);
  const senderIdRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    console.log("Kết nối Socket.IO...");

    // Import socket.io-client dynamically
    import("socket.io-client").then(({ io }) => {
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
          setChatHistory((prev) => [
            ...prev,
            { sender: "bot", text: data.text },
          ]);
        }
      });
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
    <div
      className="fixed bottom-20 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
      style={{ height: "500px" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold">Chatbot EduKho</h3>
            <span className="text-xs">
              {isConnected
                ? isSessionReady
                  ? "🟢 Online"
                  : "🟡 Đang khởi tạo..."
                : "🔴 Offline"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                msg.sender === "bot"
                  ? "bg-white text-gray-800 shadow"
                  : "bg-teal-500 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t bg-white rounded-b-2xl"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isSessionReady ? "Gõ tin nhắn..." : "Đang kết nối..."}
            disabled={!isSessionReady}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-teal-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!isSessionReady}
            className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:bg-gray-300 transition-colors"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EduKhoApp() {
  const [products, setProducts] = useState([
    {
      id: "SGK001",
      name: "Sách Toán 12",
      quantity: 40,
      category: "Sách giáo khoa",
      publisher: "Chân trời sáng tạo",
      price: 8000,
      total: 320000,
    },
    {
      id: "SGK002",
      name: "Sách Toán 12",
      quantity: 30,
      category: "Sách giáo khoa",
      publisher: "Kết nối tri thức",
      price: 8000,
      total: 240000,
    },
    {
      id: "SGK003",
      name: "Sách Toán 12",
      quantity: 20,
      category: "Sách giáo khoa",
      publisher: "Cánh diều",
      price: 8000,
      total: 160000,
    },
    {
      id: "SCD001",
      name: "Chuyên đề Toán 12",
      quantity: 10,
      category: "Sách chuyên đề",
      publisher: "Kết nối tri thức",
      price: 10000,
      total: 100000,
    },
    {
      id: "V001",
      name: "Vở ô ly",
      quantity: 60,
      category: "100 trang",
      publisher: "Hồng Hà",
      price: 10000,
      total: 600000,
    },
  ]);

  const [activeMenu, setActiveMenu] = useState("Sản Phẩm");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Tổng Quan" },
    { icon: Package, label: "Sản Phẩm" },
    { icon: Users, label: "Khách Hàng" },
    { icon: Download, label: "Nhập | Xuất" },
  ];

  const toolItems = [
    { icon: Settings, label: "Cài Đặt" },
    { icon: MessageCircle, label: "Góp Ý" },
    { icon: HelpCircle, label: "Hỗ Trợ" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#dae2f9] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <img src="/edklogo.png" alt="" />
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4">
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2 px-2">
              {sidebarOpen ? "MENU" : ""}
            </p>
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveMenu(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeMenu === item.label
                    ? "bg-slate-700"
                    : "hover:bg-slate-700"
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2 px-2">
              {sidebarOpen ? "CÔNG CỤ" : ""}
            </p>
            {toolItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 hover:bg-slate-700 transition-colors"
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu size={24} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                Hôm nay Thứ hai, ngày 20 tháng 10 năm 2025
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                  <span className="font-bold">TS</span>
                </div>
                <span className="font-semibold">Trung Sơn</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Page Title and Actions */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Trang Sản phẩm
              </h2>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                  Thêm Sản Phẩm
                </button>
                <button className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                  Tìm Kiếm
                </button>
                <button className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                  Bộ Lọc
                </button>
                <button className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                  Bộ Sách
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                      Mã sản phẩm
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                      Tên sản phẩm
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                      Số lượng
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                      Loại
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                      Nhà sản xuất
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                      Giá
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                      Tổng tiền
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                      Chức năng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="border border-slate-300 px-4 py-3">
                        {product.id}
                      </td>
                      <td className="border border-slate-300 px-4 py-3">
                        {product.name}
                      </td>
                      <td className="border border-slate-300 px-4 py-3">
                        {product.quantity}
                      </td>
                      <td className="border border-slate-300 px-4 py-3">
                        {product.category}
                      </td>
                      <td className="border border-slate-300 px-4 py-3">
                        {product.publisher}
                      </td>
                      <td className="border border-slate-300 px-4 py-3">
                        {product.price.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 px-4 py-3">
                        {product.total.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button className="p-2 hover:bg-blue-100 rounded transition-colors">
                            <Edit2 size={18} className="text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded transition-colors">
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows */}
                  <tr className="bg-white">
                    <td className="border border-slate-300 px-4 py-3">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Chat Button - Floating */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-40"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Widget */}
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
    </div>
  );
}
