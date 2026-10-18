const LIMITS = {
  name: 40,
  title: 80,
  bio: 1000,
  skill: 30,
  skills: 20,
  school: 80,
  period: 40,
  detail: 300,
  projectName: 60,
  description: 500,
  link: 200,
  email: 80,
  phone: 30,
  other: 80,
  items: 12,
};

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeProfile(input) {
  const source = input && typeof input === "object" ? input : {};
  const errors = [];

  const name = text(source.name, LIMITS.name);
  const title = text(source.title, LIMITS.title);
  const bio = text(source.bio, LIMITS.bio);
  const email = text(source.email, LIMITS.email);
  const phone = text(source.phone, LIMITS.phone);
  const other = text(source.other, LIMITS.other);

  if (!name) errors.push("请填写姓名");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("邮箱格式不正确");
  }

  const skills = asList(source.skills)
    .map((skill) => text(skill, LIMITS.skill))
    .filter(Boolean)
    .slice(0, LIMITS.skills);

  const education = asList(source.education)
    .slice(0, LIMITS.items)
    .map((item) => ({
      school: text(item?.school, LIMITS.school),
      period: text(item?.period, LIMITS.period),
      detail: text(item?.detail, LIMITS.detail),
    }))
    .filter((item) => item.school || item.period || item.detail);

  education.forEach((item, index) => {
    if (!item.school) errors.push(`请填写第 ${index + 1} 段学习经历的学校或专业`);
  });

  const projects = asList(source.projects)
    .slice(0, LIMITS.items)
    .map((item) => ({
      name: text(item?.name, LIMITS.projectName),
      period: text(item?.period, LIMITS.period),
      description: text(item?.description, LIMITS.description),
      link: text(item?.link, LIMITS.link),
    }))
    .filter((item) => item.name || item.period || item.description || item.link);

  projects.forEach((item, index) => {
    if (!item.name) errors.push(`请填写第 ${index + 1} 个项目的名称`);
    if (item.link && !/^https?:\/\/\S+$/.test(item.link)) {
      errors.push(`第 ${index + 1} 个项目的链接需要以 http:// 或 https:// 开头`);
    }
  });

  return {
    errors,
    profile: { name, title, bio, skills, education, projects, email, phone, other },
  };
}
