import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./landing.css";

export const metadata: Metadata = {
  title: {
    default: "OTHub — By OTs, For Everyone",
    template: "%s | OTHub",
  },
  description:
    "작업치료사가 만든 모두를 위한 플랫폼. 훈련 웹앱, 치료 콘텐츠, 임상 평가 도구를 한곳에서.",
};

export const viewport: Viewport = {
  themeColor: "#eef6ff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
