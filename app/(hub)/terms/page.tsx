import type { Metadata } from "next";
import Link from "next/link";
import "../hub/hub.css";
import "../privacy/privacy.css";

export const metadata: Metadata = {
  title: "이용약관 | OTHub",
  description: "OTHub 회원 가입과 도구·커뮤니티 이용에 관한 약속을 안내합니다.",
  alternates: { canonical: "/terms" },
};

/**
 * 이용약관. 서비스가 실제로 제공하는 기능(무료 도구, Google 로그인, 치료사 인증, 댓글)만 다룬다.
 * <Todo>로 감싼 부분은 운영자가 정해야 하는 값으로, 확정 전에는 공개 배포하지 않는다.
 */
function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="privacy-todo">[확정 필요] {children}</mark>;
}

const CONTACT = "h2g0614@gmail.com";

export default function TermsPage() {
  return (
    <div className="hub-shell privacy" id="main">
      <Link className="hub-back" href="/">
        ← OTHub 홈으로
      </Link>

      <header className="privacy-head">
        <p className="eyebrow">
          <span></span> TERMS
        </p>
        <h1>이용약관</h1>
        <p className="lead">
          이 약관은 <Todo>운영 주체</Todo>(이하 &lsquo;운영자&rsquo;)가 제공하는 OTHub(이하
          &lsquo;서비스&rsquo;)의 이용 조건과 절차, 운영자와 이용자의 권리·의무를 정합니다.
        </p>
        <p className="privacy-meta">
          시행일: <Todo>시행 날짜</Todo>
        </p>
      </header>

      <section className="privacy-section">
        <h2>제1조 서비스 내용</h2>
        <ul>
          <li>작업치료 훈련 도구(웹앱), 평가 도구, 정보·링크 모음, 커뮤니티(댓글·좋아요·북마크)를 제공합니다.</li>
          <li>서비스는 무료로 제공하며, 유료 결제 기능은 없습니다.</li>
          <li>운영자는 서비스 개선을 위해 도구와 화면을 바꾸거나 일부 기능을 중단할 수 있습니다. 중요한 변경은 미리 알립니다.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>제2조 회원 가입과 계정</h2>
        <ul>
          <li>회원 가입은 Google 계정으로 로그인하는 방식으로 합니다. 대부분의 도구는 로그인 없이도 쓸 수 있습니다.</li>
          <li>
            평가 기록 저장 같은 치료사 전용 기능은 작업치료사 면허번호로 인증을 신청하고 운영자가 승인한
            회원만 쓸 수 있습니다. 사실과 다른 정보로 신청하면 승인을 취소할 수 있습니다.
          </li>
          <li>계정은 본인만 사용해야 하며, 공용 기기에서는 사용 후 로그아웃해 주세요.</li>
          <li>회원은 언제든 탈퇴를 요청할 수 있습니다. 요청 방법: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>제3조 도구 이용 시 유의사항</h2>
        <ul>
          <li>
            서비스의 도구는 치료 활동을 돕기 위한 것이며, 진단이나 의학적 판단을 대신하지 않습니다. 평가
            결과의 해석과 임상 판단은 담당 치료사의 책임입니다.
          </li>
          <li>
            키오스크 훈련 도구 등에 나오는 상호와 메뉴는 실제 매장 이용을 연습하기 위해 비슷하게 만든
            훈련용 모형입니다. 해당 기업과 제휴·후원 관계가 없으며, 실제 가격·메뉴와 다를 수 있습니다.
          </li>
          <li>
            평가 도구에는 대상자의 실명 대신 임의의 코드를 입력해 주세요. 진단명과 생년월일은 인쇄용
            보고서에만 표시되고 서버에 저장되지 않습니다.
          </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>제4조 게시물 규칙</h2>
        <p>댓글 등 회원이 올린 게시물에는 다음 내용을 올릴 수 없습니다.</p>
        <ul>
          <li>환자·대상자의 실명, 사진, 연락처 등 개인을 알아볼 수 있는 정보</li>
          <li>다른 사람을 비방하거나 명예를 훼손하는 내용, 차별·혐오 표현</li>
          <li>광고·홍보, 같은 내용의 반복 게시</li>
          <li>다른 사람의 저작물을 허락 없이 옮긴 내용, 그 밖에 법령에 어긋나는 내용</li>
        </ul>
        <p>
          운영자는 이런 게시물을 알리지 않고 삭제할 수 있고, 반복되면 해당 계정의 이용을 제한할 수
          있습니다. 게시물의 저작권은 작성한 회원에게 있습니다.
        </p>
      </section>

      <section className="privacy-section">
        <h2>제5조 이용 제한</h2>
        <p>
          서비스 운영을 방해하거나(비정상적인 대량 접근, 보안 우회 시도 등) 이 약관을 어긴 경우 운영자는
          이용을 제한하거나 계정을 정지할 수 있습니다. 이 경우 이유를 알리고 소명할 기회를 드립니다.
        </p>
      </section>

      <section className="privacy-section">
        <h2>제6조 콘텐츠의 권리</h2>
        <p>
          서비스가 제공하는 도구·문구·이미지의 권리는 운영자 또는 각 제작자에게 있습니다.
          <Todo>도구 소스 공개 여부와 라이선스(예: MIT), 치료 현장에서의 이용·출력 허용 범위</Todo>
        </p>
      </section>

      <section className="privacy-section">
        <h2>제7조 책임의 한계</h2>
        <ul>
          <li>운영자는 천재지변, 외부 서비스(호스팅·인증 업체)의 장애 등 운영자가 막을 수 없는 사유로 생긴 서비스 중단에 대해 책임지지 않습니다.</li>
          <li>무료로 제공하는 서비스이므로, 운영자의 고의나 중대한 과실이 없는 한 서비스 이용으로 생긴 손해에 대해 책임지지 않습니다.</li>
          <li>회원이 올린 게시물의 내용에 대한 책임은 작성한 회원에게 있습니다.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>제8조 개인정보 보호</h2>
        <p>
          개인정보의 처리는 <Link href="/privacy">개인정보처리방침</Link>을 따릅니다.
        </p>
      </section>

      <section className="privacy-section">
        <h2>제9조 약관의 변경과 분쟁 해결</h2>
        <ul>
          <li>약관을 바꾸면 시행 7일 전부터 이 페이지에 알립니다. 회원에게 불리한 변경은 30일 전부터 알립니다.</li>
          <li>이 약관은 대한민국 법을 따르며, 분쟁이 생기면 먼저 성실히 협의합니다. <Todo>관할 법원</Todo></li>
          <li>문의: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></li>
        </ul>
      </section>
    </div>
  );
}
