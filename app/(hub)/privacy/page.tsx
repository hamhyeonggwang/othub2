import type { Metadata } from "next";
import Link from "next/link";
import "../hub/hub.css";
import "./privacy.css";

export const metadata: Metadata = {
  title: "개인정보처리방침 | OTHub",
  description: "OTHub가 처리하는 개인정보의 항목, 목적, 보관과 파기, 정보주체의 권리를 안내합니다.",
  alternates: { canonical: "/privacy" },
};

/**
 * 개인정보처리방침.
 * 수집 항목·저장 위치·접근 통제는 코드와 DB 설정에서 확인한 사실만 적는다.
 * <Todo>로 감싼 부분은 운영자가 정해야 하는 값으로, 확정 전에는 공개 배포하지 않는다.
 */
function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="privacy-todo">[확정 필요] {children}</mark>;
}

const CONTACT = "h2g0614@gmail.com";

export default function PrivacyPage() {
  return (
    <div className="hub-shell privacy" id="main">
      <Link className="hub-back" href="/">
        ← OTHub 홈으로
      </Link>

      <header className="privacy-head">
        <p className="eyebrow">
          <span></span> PRIVACY
        </p>
        <h1>개인정보처리방침</h1>
        <p className="lead">
          OTHub(이하 &lsquo;서비스&rsquo;)는 「개인정보 보호법」에 따라 이용자의 개인정보를
          보호하고, 관련 고충을 신속하게 처리하기 위해 다음과 같이 개인정보처리방침을 둡니다.
        </p>
        <p className="privacy-meta">
          시행일: <Todo>시행 날짜</Todo>
        </p>
      </header>

      <nav className="privacy-toc" aria-label="목차">
        <ol>
          <li><a href="#items">처리하는 개인정보와 목적</a></li>
          <li><a href="#tools">도구(웹앱) 이용 시 정보</a></li>
          <li><a href="#retention">보유 기간과 파기</a></li>
          <li><a href="#third">제3자 제공</a></li>
          <li><a href="#outsourcing">처리 위탁과 국외 이전</a></li>
          <li><a href="#cookies">쿠키와 방문 통계</a></li>
          <li><a href="#rights">이용자의 권리와 행사 방법</a></li>
          <li><a href="#safety">안전성 확보 조치</a></li>
          <li><a href="#officer">개인정보 보호책임자</a></li>
          <li><a href="#changes">방침의 변경</a></li>
        </ol>
      </nav>

      <section id="items" className="privacy-section">
        <h2>1. 처리하는 개인정보와 목적</h2>
        <div className="privacy-table-wrap" role="region" aria-label="처리하는 개인정보 표" tabIndex={0}>
          <table>
            <thead>
              <tr><th scope="col">구분</th><th scope="col">항목</th><th scope="col">목적</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>회원 가입·로그인 (Google 계정)</td>
                <td>이메일 주소, Google 계정 고유 식별자, 표시 이름</td>
                <td>회원 식별, 로그인 유지, 내 정보 화면 표시</td>
              </tr>
              <tr>
                <td>치료사 인증 신청 (선택)</td>
                <td>작업치료사 면허번호, 소속 기관(선택 입력)</td>
                <td>치료사 회원 자격 확인과 승인 (관리자가 승인을 위해 확인)</td>
              </tr>
              <tr>
                <td>커뮤니티 활동</td>
                <td>작성한 댓글, 좋아요·북마크 기록</td>
                <td>댓글 표시, 저장한 콘텐츠 모아 보기</td>
              </tr>
              <tr>
                <td>평가 기록 저장 (치료사 회원이 직접 저장할 때)</td>
                <td>
                  치료사가 입력한 대상자 코드, 성별, 담당 치료사, 평가일, 평가 결과 보고서
                </td>
                <td>치료사 본인의 평가 기록 보관과 다시 보기</td>
              </tr>
              <tr>
                <td>방문 통계</td>
                <td>방문한 페이지 경로, 무작위 방문자 식별자(쿠키)</td>
                <td>페이지별 방문 수 집계와 서비스 개선</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          평가 화면에서 입력하는 진단명과 생년월일은 인쇄·PDF용 보고서에만 표시되며, 서버에는 저장하지
          않습니다. 평가 결과 보고서를 저장할 때도 이 두 값은 지운 뒤 저장합니다. 대상자는 실명 대신
          임의의 코드로 입력해 주세요.
        </p>
      </section>

      <section id="tools" className="privacy-section">
        <h2>2. 도구(웹앱) 이용 시 정보</h2>
        <ul>
          <li>
            카메라를 쓰는 도구는 손·몸 움직임을 이용자의 브라우저 안에서만 분석합니다. 카메라 영상은
            서버로 전송하거나 저장하지 않습니다.
          </li>
          <li>
            일부 도구는 훈련 설정이나 기록을 이용자 기기의 브라우저 저장소에만 보관합니다. 이 정보는
            서버로 전송되지 않으며, 브라우저의 사이트 데이터 삭제로 지울 수 있습니다.
          </li>
          <li>
            &lsquo;일상 인지활동&rsquo;에서 대상자가 입력한 이야기는 페이지 메모리에만 있다가 세션을
            끝내면 지워지며, 서버나 브라우저 저장소에 저장하지 않습니다.
          </li>
        </ul>
      </section>

      <section id="retention" className="privacy-section">
        <h2>3. 보유 기간과 파기</h2>
        <ul>
          <li>회원 정보와 활동 기록: 회원 탈퇴 시까지. 탈퇴하면 바로 삭제합니다.</li>
          <li>평가 기록: <Todo>보유 기간과 삭제 방법</Todo></li>
          <li>방문 통계: <Todo>보유 기간</Todo></li>
        </ul>
        <p>
          보유 기간이 끝나거나 처리 목적을 달성한 개인정보는 지체 없이 복구할 수 없는 방법으로
          파기합니다. 회원은 My Hub의 &lsquo;회원 탈퇴&rsquo;에서 직접 탈퇴할 수 있으며, 탈퇴하면 프로필(치료사
          인증 정보 포함), 댓글, 좋아요, 북마크, 평가 기록을 바로 삭제합니다. Google 로그인 계정은 같은
          계정을 쓰는 다른 서비스가 있어 삭제하지 않으며, 계정 삭제는 아래 연락처로 요청할 수 있습니다.
        </p>
      </section>

      <section id="third" className="privacy-section">
        <h2>4. 제3자 제공</h2>
        <p>
          서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 특별한 규정이 있는
          경우는 예외로 합니다. <Todo>제3자 제공이 없다는 운영 방침 확인</Todo>
        </p>
      </section>

      <section id="outsourcing" className="privacy-section">
        <h2>5. 처리 위탁과 국외 이전</h2>
        <p>서비스 운영을 위해 다음 업체의 서비스를 이용합니다.</p>
        <div className="privacy-table-wrap" role="region" aria-label="처리 위탁 업체 표" tabIndex={0}>
          <table>
            <thead>
              <tr><th scope="col">업체</th><th scope="col">위탁 업무</th><th scope="col">저장·처리 국가</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Supabase, Inc.</td>
                <td>회원 인증, 데이터베이스(회원·활동·평가 기록·방문 통계) 저장</td>
                <td>싱가포르 (ap-southeast-1 리전)</td>
              </tr>
              <tr>
                <td>Vercel Inc.</td>
                <td>웹사이트 호스팅과 전송</td>
                <td>미국 등 <Todo>처리 리전</Todo></td>
              </tr>
              <tr>
                <td>Google LLC</td>
                <td>Google 계정 로그인</td>
                <td>미국 등</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          개인정보는 이용자가 서비스를 이용할 때 네트워크를 통해 위 업체의 서버로 전송됩니다.
          <Todo>국외 이전 고지 항목 (이전 일시·방법, 보유 기간, 업체 연락처)과 이전 거부 방법</Todo>
        </p>
      </section>

      <section id="cookies" className="privacy-section">
        <h2>6. 쿠키와 방문 통계</h2>
        <ul>
          <li>
            로그인 쿠키: 로그인 상태를 유지하기 위해 인증 쿠키를 사용합니다.
          </li>
          <li>
            방문자 식별 쿠키(<code>othub_vid</code>): 페이지별 방문 수를 세기 위한 무작위 값으로,
            이름이나 이메일과 연결하지 않습니다. 유효 기간은 1년입니다.
          </li>
          <li>
            방문 통계에는 페이지 경로만 기록하며, 검색어나 평가 기록 주소 같은 세부 정보는 남기지
            않습니다. 브라우저에서 &lsquo;추적 안 함(Do Not Track)&rsquo;을 켜면 방문 통계를
            기록하지 않습니다.
          </li>
          <li>브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 이 경우 로그인이 필요한 기능을 쓸 수 없습니다.</li>
        </ul>
      </section>

      <section id="rights" className="privacy-section">
        <h2>7. 이용자의 권리와 행사 방법</h2>
        <p>
          이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다.
          아래 연락처로 요청하시면 지체 없이 조치하고 결과를 알려 드립니다.
        </p>
        <p>
          요청 연락처: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>
      </section>

      <section id="safety" className="privacy-section">
        <h2>8. 안전성 확보 조치</h2>
        <ul>
          <li>모든 통신은 HTTPS로 암호화합니다.</li>
          <li>
            데이터베이스의 모든 테이블에 행 단위 접근 제어(RLS)를 적용해, 예를 들어 평가 기록은 저장한
            치료사 본인만 조회할 수 있도록 제한합니다.
          </li>
          <li>관리 기능은 관리자 권한이 있는 계정만 사용할 수 있습니다.</li>
        </ul>
      </section>

      <section id="officer" className="privacy-section">
        <h2>9. 개인정보 보호책임자</h2>
        <ul>
          <li>성명·직책: <Todo>개인정보 보호책임자</Todo></li>
          <li>운영 주체: <Todo>개인 또는 기관명</Todo></li>
          <li>연락처: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></li>
        </ul>
        <p>
          개인정보 침해에 대한 신고나 상담은 개인정보침해신고센터(국번 없이 118, privacy.kisa.or.kr),
          개인정보분쟁조정위원회(1833-6972, www.kopico.go.kr)에도 할 수 있습니다.
        </p>
      </section>

      <section id="changes" className="privacy-section">
        <h2>10. 방침의 변경</h2>
        <p>
          이 방침의 내용이 바뀌면 시행 7일 전부터 이 페이지에 알립니다.
        </p>
      </section>
    </div>
  );
}
