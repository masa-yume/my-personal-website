"use client";

import { useEffect, useState } from "react";

const emptyEducation = () => ({ school: "", period: "", detail: "" });
const emptyProject = () => ({ name: "", period: "", description: "", link: "" });

export default function AdminPage() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "资料加载失败");
        setProfile(data.profile);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  function update(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function updateItem(field, index, key, value) {
    setProfile((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(data.error || "保存失败");
      return;
    }

    setProfile(data.profile);
    setMessage("已保存。刷新页面后，修改仍然存在。");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (!profile) {
    return (
      <main className="page">
        {error ? <p className="error">{error}</p> : <p>正在加载资料...</p>}
      </main>
    );
  }

  return (
    <main className="page">
      <div className="admin-bar">
        <h1>编辑资料</h1>
        <div className="actions">
          <a className="button secondary" href="/">
            查看前台
          </a>
          <button className="secondary" type="button" onClick={logout}>
            退出登录
          </button>
        </div>
      </div>

      <form className="panel" onSubmit={save}>
        {message ? <p className="notice">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}

        <label htmlFor="name">姓名</label>
        <input id="name" value={profile.name} onChange={(event) => update("name", event.target.value)} />

        <label htmlFor="title">一句话介绍</label>
        <input id="title" value={profile.title} onChange={(event) => update("title", event.target.value)} />

        <label htmlFor="bio">个人简介</label>
        <textarea id="bio" value={profile.bio} onChange={(event) => update("bio", event.target.value)} />

        <label htmlFor="skills">技能（每行一个）</label>
        <textarea
          id="skills"
          value={profile.skills.join("\n")}
          onChange={(event) => update("skills", event.target.value.split("\n"))}
        />

        <h2>学习经历</h2>
        {profile.education.map((item, index) => (
          <div className="repeat" key={`education-${index}`}>
            <label htmlFor={`school-${index}`}>学校或专业</label>
            <input
              id={`school-${index}`}
              value={item.school}
              onChange={(event) => updateItem("education", index, "school", event.target.value)}
            />
            <label htmlFor={`edu-period-${index}`}>时间</label>
            <input
              id={`edu-period-${index}`}
              value={item.period}
              onChange={(event) => updateItem("education", index, "period", event.target.value)}
            />
            <label htmlFor={`detail-${index}`}>说明</label>
            <textarea
              id={`detail-${index}`}
              value={item.detail}
              onChange={(event) => updateItem("education", index, "detail", event.target.value)}
            />
            <button
              className="secondary"
              type="button"
              onClick={() =>
                update(
                  "education",
                  profile.education.filter((_, itemIndex) => itemIndex !== index)
                )
              }
            >
              删除这段经历
            </button>
          </div>
        ))}
        <div className="actions">
          <button
            className="secondary"
            type="button"
            onClick={() => update("education", [...profile.education, emptyEducation()])}
          >
            添加学习经历
          </button>
        </div>

        <h2>项目经历</h2>
        {profile.projects.map((item, index) => (
          <div className="repeat" key={`project-${index}`}>
            <label htmlFor={`project-${index}`}>项目名称</label>
            <input
              id={`project-${index}`}
              value={item.name}
              onChange={(event) => updateItem("projects", index, "name", event.target.value)}
            />
            <label htmlFor={`project-period-${index}`}>时间</label>
            <input
              id={`project-period-${index}`}
              value={item.period}
              onChange={(event) => updateItem("projects", index, "period", event.target.value)}
            />
            <label htmlFor={`description-${index}`}>项目说明</label>
            <textarea
              id={`description-${index}`}
              value={item.description}
              onChange={(event) => updateItem("projects", index, "description", event.target.value)}
            />
            <label htmlFor={`link-${index}`}>项目链接（可选）</label>
            <input
              id={`link-${index}`}
              value={item.link}
              placeholder="https://"
              onChange={(event) => updateItem("projects", index, "link", event.target.value)}
            />
            <button
              className="secondary"
              type="button"
              onClick={() =>
                update(
                  "projects",
                  profile.projects.filter((_, itemIndex) => itemIndex !== index)
                )
              }
            >
              删除这个项目
            </button>
          </div>
        ))}
        <div className="actions">
          <button
            className="secondary"
            type="button"
            onClick={() => update("projects", [...profile.projects, emptyProject()])}
          >
            添加项目
          </button>
        </div>

        <h2>联系方式</h2>
        <label htmlFor="email">邮箱</label>
        <input id="email" value={profile.email} onChange={(event) => update("email", event.target.value)} />
        <label htmlFor="phone">电话</label>
        <input id="phone" value={profile.phone} onChange={(event) => update("phone", event.target.value)} />
        <label htmlFor="other">其他联系方式</label>
        <input id="other" value={profile.other} onChange={(event) => update("other", event.target.value)} />

        <div className="actions">
          <button type="submit" disabled={saving}>
            {saving ? "正在保存..." : "保存"}
          </button>
        </div>
      </form>
    </main>
  );
}
