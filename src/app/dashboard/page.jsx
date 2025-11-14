// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import để tắt SSR
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), {
  ssr: false,
});

export default function DashboardPage() {
  const [userName, setUserName] = useState("Đang tải...");

  useEffect(() => {
    setTimeout(() => {
      setUserName("Chủ kho EduKho");
    }, 1000);
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>
        Trang Tổng Quan (CSR)
      </h1>
      <p style={{ marginTop: "1rem" }}>
        Chào mừng trở lại, <strong>{userName}</strong>!
      </p>
      <hr style={{ margin: "20px 0" }} />
      <ChatWidget />
    </main>
  );
}
