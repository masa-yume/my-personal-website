import { readProfile } from "../lib/store";

export const dynamic = "force-dynamic";

function EmptyText() {
  return <p className="muted">暂时还没有内容。</p>;
}

export default async function HomePage() {
  const profile = await readProfile();
  const initial = profile.name ? profile.name.slice(0, 1) : "我";

  return (
    <div className="page">
      <header className="topbar">
        <span className="brand">个人主页</span>
        <a href="/admin">管理资料</a>
      </header>

      <section className="hero">
        <div className="avatar" aria-hidden="true">
          {initial}
        </div>
        <div>
          <h1>{profile.name || "未填写姓名"}</h1>
          {profile.title ? <p className="role">{profile.title}</p> : null}
          <p>{profile.bio || "暂时还没有个人简介。"}</p>
        </div>
      </section>

      <section className="section">
        <h2>技能</h2>
        {profile.skills.length > 0 ? (
          <ul className="tags">
            {profile.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : (
          <EmptyText />
        )}
      </section>

      <section className="section">
        <h2>学习经历</h2>
        {profile.education.length > 0 ? (
          <div className="stack">
            {profile.education.map((item) => (
              <article className="card" key={`${item.school}-${item.period}`}>
                <div className="card-head">
                  <h3>{item.school}</h3>
                  {item.period ? <span className="period">{item.period}</span> : null}
                </div>
                {item.detail ? <p>{item.detail}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyText />
        )}
      </section>

      <section className="section">
        <h2>项目经历</h2>
        {profile.projects.length > 0 ? (
          <div className="stack">
            {profile.projects.map((item) => (
              <article className="card" key={`${item.name}-${item.period}`}>
                <div className="card-head">
                  <h3>{item.name}</h3>
                  {item.period ? <span className="period">{item.period}</span> : null}
                </div>
                {item.description ? <p>{item.description}</p> : null}
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer">
                    查看项目
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyText />
        )}
      </section>

      <section className="section">
        <h2>联系方式</h2>
        <div className="card">
          <ul className="contact-list">
            <li>邮箱：{profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : "未填写"}</li>
            <li>电话：{profile.phone || "未填写"}</li>
            <li>其他：{profile.other || "未填写"}</li>
          </ul>
        </div>
      </section>

      <p className="footer">页面内容可在登录后台后修改。</p>
    </div>
  );
}
