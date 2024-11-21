"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "/styles/Auth.module.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return false;
      }
      if (!formData.name) {
        setError("Vui lòng nhập tên của bạn");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isLogin
            ? {
                email: formData.email,
                password: formData.password,
              }
            : {
                email: formData.email,
                password: formData.password,
                name: formData.name,
              }
        ),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>{isLogin ? "Đăng nhập" : "Đăng ký"}</h1>

        {error && <div className={styles.error}>{error}</div>}

        {!isLogin && (
          <div className={styles.formGroup}>
            <label>Họ tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Nhập họ tên của bạn"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="example@email.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Nhập mật khẩu"
          />
        </div>

        {!isLogin && (
          <div className={styles.formGroup}>
            <label>Xác nhận mật khẩu:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Nhập lại mật khẩu"
            />
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${isLoading ? styles.loading : ""}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingText}>
                {isLogin ? "Đang đăng nhập..." : "Đang đăng ký..."}
              </span>
            ) : isLogin ? (
              "Đăng nhập"
            ) : (
              "Đăng ký"
            )}
          </button>

          <button
            type="button"
            onClick={switchMode}
            className={`${styles.button} ${styles.secondaryButton}`}
            disabled={isLoading}
          >
            {isLogin ? "Tạo tài khoản mới" : "Đã có tài khoản"}
          </button>
        </div>

        {isLoading && <div className={styles.spinner}></div>}
      </form>
    </div>
  );
}
