import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * 공유 미리보기(OG/Twitter 카드)용 이미지 렌더러.
 * next/og(satori)는 기본 번들 폰트에 한글 글리프가 없어 한글 텍스트가
 * 깨져 보일 수 있으므로, 폰트 의존성이 없는 로고 + 영문 워드마크만 사용한다.
 */
export async function renderOgImage(width: number, height: number) {
  const markBuffer = await readFile(
    join(process.cwd(), "public/brand/othub-mark.png")
  );
  const markSrc = `data:image/png;base64,${markBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg, #071b3f 0%, #104da7 55%, #21bff3 100%)",
        }}
      >
        <img
          src={markSrc}
          width={120}
          height={120}
          style={{ borderRadius: 30, marginBottom: 44 }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 86,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#ffffff",
          }}
        >
          OTHub
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            marginTop: 22,
            color: "#cfe3f9",
            maxWidth: 900,
          }}
        >
          By OTs, For Everyone
        </div>
      </div>
    ),
    { width, height }
  );
}
