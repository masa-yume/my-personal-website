import "./globals.css";

export const metadata = {
  title: "个人介绍",
  description: "课程作业个人介绍网站",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
