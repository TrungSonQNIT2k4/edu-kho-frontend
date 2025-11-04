// app/dashboard/page.jsx
"use client"; // <-- LUÔN LUÔN LÀ DÒNG ĐẦU TIÊN!

import { useState, useEffect } from "react";

// Component này sẽ chạy ở Client (trình duyệt)
export default function DashboardPage() {
  const [userName, setUserName] = useState("Đang tải...");

  // Giả lập việc fetch dữ liệu
  useEffect(() => {
    // Code này chỉ chạy ở trình duyệt
    // Sau này, chúng ta sẽ dùng nó để kết nối Socket.io đến RASA
    setTimeout(() => {
      setUserName("Chủ kho EduKho");
    }, 1000);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Trang Tổng Quan (CSR)</h1>
      <p className="mt-4">
        Chào mừng trở lại, <b>{userName}</b>!
      </p>
      {/*
        <ChatWidget />  <-- Chatbot RASA sẽ được đặt ở đây
      */}
    </main>
  );
}
