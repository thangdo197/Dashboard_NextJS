"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "/styles/Dashboard.module.css";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra token khi component mount
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    // Decode token để lấy email người dùng
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.user);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Đăng xuất
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.welcomeCard}>
          <h2>Xin chào, {userEmail}!</h2>
          <p>Chào mừng bạn đến với dashboard</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Thống kê 1</h3>
            <p>0</p>
          </div>
          <div className={styles.statCard}>
            <h3>Thống kê 2</h3>
            <p>0</p>
          </div>
          <div className={styles.statCard}>
            <h3>Thống kê 3</h3>
            <p>0</p>
          </div>
          <div className={styles.statCard}>
            <h3>Thống kê 4</h3>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
