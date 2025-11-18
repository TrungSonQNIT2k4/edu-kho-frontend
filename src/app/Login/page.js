"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({
    username: false,
    password: false,
    login: false,
  });

  // Register state
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false,
    passwordMatch: false,
  });

  const VALID_USER = "trungson";
  const VALID_PASS = "123456";

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    setLoginErrors({ username: false, password: false, login: false });

    let isValid = true;
    const newErrors = { username: false, password: false, login: false };

    if (!username.trim()) {
      newErrors.username = true;
      isValid = false;
    }

    if (!password) {
      newErrors.password = true;
      isValid = false;
    }

    if (isValid) {
      if (username === VALID_USER && password === VALID_PASS) {
        alert("Đăng nhập thành công! Chào mừng " + username);
        router.push("/product");
      } else {
        newErrors.login = true;
      }
    }

    setLoginErrors(newErrors);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    setRegisterErrors({
      email: false,
      newPassword: false,
      confirmPassword: false,
      passwordMatch: false,
    });

    let isValid = true;
    const newErrors = {
      email: false,
      newPassword: false,
      confirmPassword: false,
      passwordMatch: false,
    };

    if (!email.trim()) {
      newErrors.email = true;
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = true;
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = true;
      isValid = false;
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.passwordMatch = true;
      isValid = false;
    }

    if (isValid) {
      alert("Đăng ký thành công!");
      setActiveTab("login");
    }

    setRegisterErrors(newErrors);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M50 10 L30 30 L50 50 L30 70 L50 90 L70 70 L50 50 L70 30 Z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-blue-900">EduKho</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Chào mừng bạn đến với
          </h1>
          <p className="text-gray-600 mb-8">Hệ thống quản lí văn phòng phẩm</p>

          {/* Tabs */}
          <div className="flex mb-8 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === "login"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Đăng nhập
              {activeTab === "login" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === "register"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Đăng ký
              {activeTab === "register" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập Email hoặc số điện thoại"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {loginErrors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    Vui lòng nhập tên tài khoản
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    Vui lòng nhập mật khẩu
                  </p>
                )}
              </div>

              {loginErrors.login && (
                <p className="text-red-500 text-sm">
                  Tên đăng nhập hoặc mật khẩu không đúng!
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-3 px-4 rounded-full transition-colors duration-200"
              >
                Đăng nhập
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập Email hoặc số điện thoại"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {registerErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    Vui lòng nhập email hoặc số điện thoại
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tạo Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {registerErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    Vui lòng nhập mật khẩu
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {registerErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    Vui lòng xác nhận mật khẩu
                  </p>
                )}
                {registerErrors.passwordMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    Mật khẩu không khớp
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-3 px-4 rounded-full transition-colors duration-200"
              >
                Đăng ký
              </button>
            </form>
          )}
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-12">
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="w-80 h-80 mx-auto"
                viewBox="0 0 400 400"
                fill="none"
              >
                <circle cx="200" cy="120" r="60" fill="#3B82F6" opacity="0.2" />
                <circle cx="200" cy="120" r="40" fill="#3B82F6" opacity="0.4" />
                <rect
                  x="120"
                  y="200"
                  width="160"
                  height="180"
                  rx="8"
                  fill="#3B82F6"
                  opacity="0.3"
                />
                <path d="M200 80 L180 100 L200 120 L220 100 Z" fill="#3B82F6" />
                <rect
                  x="140"
                  y="220"
                  width="40"
                  height="140"
                  rx="4"
                  fill="#6366F1"
                />
                <rect
                  x="190"
                  y="220"
                  width="40"
                  height="140"
                  rx="4"
                  fill="#8B5CF6"
                />
                <rect
                  x="240"
                  y="220"
                  width="20"
                  height="140"
                  rx="4"
                  fill="#6366F1"
                />
              </svg>
            </div>
            <h2 className="text-5xl font-bold text-gray-800">EduKho</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
