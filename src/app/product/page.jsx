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
  X,
  Minimize2, // Thêm icon thu nhỏ
} from "lucide-react";

// ChatWidget Component
function ChatWidget({ onClose, isVisible }) {
  // 1. Sửa khởi tạo state: Lấy từ localStorage nếu có để giữ tin nhắn khi F5
  const [chatHistory, setChatHistory] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eduKho_chatHistory");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  const socketRef = useRef(null);
  const senderIdRef = useRef(null);
  const chatEndRef = useRef(null);

  // 2. Lưu tin nhắn vào localStorage mỗi khi có tin mới
  useEffect(() => {
    localStorage.setItem("eduKho_chatHistory", JSON.stringify(chatHistory));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    console.log("Kết nối Socket.IO...");

    import("socket.io-client").then(({ io }) => {
      // Chỉ khởi tạo socket một lần
      if (!socketRef.current) {
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
      }
    });

    // Cleanup: Chỉ disconnect khi component thực sự bị hủy (tắt tab/rời trang hẳn)
    return () => {
      // Nếu bạn muốn giữ kết nối kể cả khi unmount tạm thời thì comment dòng dưới
      // socketRef.current?.disconnect();
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

  // Hàm xóa lịch sử chat
  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem("eduKho_chatHistory");
  };

  return (
    <div
      className="fixed bottom-20 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out"
      style={{ height: "500px" }}
    >
      {/* Header */}
      <div className="bg-sky-100 text-black p-4 rounded-t-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center shadow-inner">
            <MessageCircle size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Chatbot EduKho</h3>
            <span className="text-xs flex items-center gap-1">
              {isConnected ? (
                isSessionReady ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                    Online
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>{" "}
                    Đang khởi tạo...
                  </>
                )
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>{" "}
                  Offline
                </>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearHistory}
            className="hover:bg-white/30 rounded-full p-2 transition-colors text-gray-600"
            title="Xóa lịch sử"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/30 rounded-full p-2 transition-colors text-gray-600"
            title="Thu nhỏ"
          >
            <Minimize2 size={18} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-400 mt-10 text-sm">
            <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.sender === "bot"
                  ? "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"
                  : "bg-sky-500 text-white shadow-md rounded-tr-none"
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
        className="p-3 border-t bg-white rounded-b-2xl"
      >
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isSessionReady ? "Nhập tin nhắn..." : "Đang kết nối..."
            }
            disabled={!isSessionReady}
            className="flex-1 pl-4 pr-12 py-2.5 bg-gray-100 border-none text-black text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!isSessionReady || !message.trim()}
            className="absolute right-1 top-1 bottom-1 px-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
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
        } bg-sky-100 text-black transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <img src="/edklogo.png" alt="" />
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4">
          <div className="mb-6">
            <p className="text-xs text-gray-500 font-bold mb-2 px-2 uppercase">
              {sidebarOpen ? "MENU" : "..."}
            </p>
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveMenu(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  activeMenu === item.label
                    ? "bg-white shadow-sm text-blue-600 font-medium"
                    : "hover:bg-white/50 text-slate-600"
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold mb-2 px-2 uppercase">
              {sidebarOpen ? "CÔNG CỤ" : "..."}
            </p>
            {toolItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 hover:bg-white/50 transition-colors text-slate-600"
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
        <header className="bg-white border-b border-gray-200 text-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm font-medium text-gray-500 hidden md:block">
                Hôm nay Thứ hai, ngày 20 tháng 10 năm 2025
              </div>
              <div className="flex items-center gap-3 pl-6 border-l">
                <div className="w-10 h-10 rounded-full bg-sky-100 border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="font-bold text-sky-600">TS</span>
                </div>
                <div className="hidden md:block">
                  <p className="font-bold text-sm">Trung Sơn</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 bg-slate-50">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Page Title and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Quản lý Sản phẩm
              </h2>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 font-semibold bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all shadow-sm shadow-sky-200">
                  <Plus size={18} />
                  Thêm mới
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 font-medium bg-white border border-gray-200 text-slate-600 rounded-lg hover:bg-gray-50 transition-all">
                  <Search size={18} />
                  Tìm kiếm
                </button>
                <button className="px-5 py-2.5 font-medium bg-white border border-gray-200 text-slate-600 rounded-lg hover:bg-gray-50 transition-all">
                  Bộ Lọc
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Mã SP
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tên sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Nhà sản xuất
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${product.quantity < 20 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.publisher}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.price.toLocaleString()} ₫
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {product.total.toLocaleString()} ₫
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div className="flex gap-2 justify-center">
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                            <Edit2
                              size={16}
                              className="text-gray-400 group-hover:text-blue-600"
                            />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                            <Trash2
                              size={16}
                              className="text-gray-400 group-hover:text-red-600"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Mockup */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Đang xem <span className="font-medium">1</span> đến{" "}
                    <span className="font-medium">5</span> trên{" "}
                    <span className="font-medium">20</span> kết quả
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="relative z-10 inline-flex items-center bg-sky-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      2
                    </button>
                    <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chat Button - Floating */}
      <button
        onClick={() => setChatOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-sky-500 text-white rounded-full shadow-lg shadow-sky-300 hover:scale-110 hover:bg-sky-600 transition-all flex items-center justify-center z-40 ${
          chatOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <MessageCircle size={28} />
      </button>

      {/* QUAN TRỌNG:
         Thay vì render có điều kiện (&&), ta dùng class 'hidden'.
         Điều này giúp ChatWidget không bị unmount, giữ nguyên state và kết nối socket.
      */}
      <div className={chatOpen ? "block" : "hidden"}>
        <ChatWidget onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
}
