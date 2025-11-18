"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-[#bbd6fd] shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/edklogo.png"
                alt=""
                className="w-20 h-13 object-contain"
              />
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <Link
                href="#"
                className="text-white hover:text-blue-200 transition-colors"
              >
                Giới thiệu
              </Link>
              <Link
                href="#"
                className="text-white hover:text-blue-200 transition-colors"
              >
                Hướng dẫn
              </Link>
              <Link
                href="/Login"
                className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="#"
                className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-400 transition-colors"
              >
                Đăng ký
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Chuẩn ý người bán
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Bám Sát thực tế người Việt.
            </h1>

            <div className="flex gap-4">
              <Link href="/Login">
                <button className="px-8 py-3 bg-slate-400 text-slate-800 font-medium rounded-lg hover:bg-slate-300 transition-colors shadow-md">
                  Đăng ký miễn phí
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-transparent border-2 border-slate-700 text-slate-700 font-medium rounded-lg hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2">
                  Khám phá ngay
                  <span className="text-xl">▶</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="relative h-[500px]">
            <img src="/introimg.png" alt="" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
