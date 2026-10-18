"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if (!password.trim()) {
      setError("请输入密码");
      return;
    }

    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "登录失败");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="page">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>后台登录</h1>
        <p className="muted">登录后才能修改个人资料和项目内容。</p>
        {error ? <p className="error">{error}</p> : null}
        <label htmlFor="password">密码</label>
        <input
          id="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? "正在登录..." : "登录"}
          </button>
          <a className="button secondary" href="/">
            返回前台
          </a>
        </div>
      </form>
    </main>
  );
}
