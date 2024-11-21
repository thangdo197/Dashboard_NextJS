import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Auth.module.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
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
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
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
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
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
            />
          </div>
        )}

        <button className={styles.button} type="submit">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>

        <p className={styles.switchText}>
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <span className={styles.switchLink} onClick={switchMode}>
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </span>
        </p>
      </form>
    </div>
  );
}
