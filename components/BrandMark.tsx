import Image from "next/image";

/** 실제 OTHub 로고 마크(꽃잎 원 + OT 모노그램). brand-mark/auth-brand-mark
 *  컨테이너 안에서 100% 크기로 채워지도록 설계된 정사각 투명 PNG. */
export default function BrandMark() {
  return (
    <Image
      src="/brand/othub-mark.png"
      alt=""
      width={80}
      height={80}
      priority
    />
  );
}
