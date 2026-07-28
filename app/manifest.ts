import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OTHub — By OTs, For Everyone",
    short_name: "OTHub",
    description:
      "작업치료사가 만든 모두를 위한 플랫폼. 훈련 웹앱, 치료 콘텐츠, 임상 평가 도구를 한곳에서.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef6ff",
    theme_color: "#eef6ff",
    lang: "ko",
    icons: [
      {
        src: "/icon.png",
        sizes: "340x340",
        type: "image/png",
      },
    ],
  };
}
