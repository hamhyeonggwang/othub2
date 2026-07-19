import { useState } from 'react';

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export default function InfoPage({ initialInfo, onNext, onBack }) {
  const today = new Date().toISOString().slice(0, 10);

  const [info, setInfo] = useState({
    name: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    address: '',
    school: '',
    grade: '',
    occupation: '',
    ma: '',
    iq: '',
    fatherJob: '',
    fatherEdu: '',
    motherJob: '',
    motherEdu: '',
    interviewee: '',
    relationship: '',
    examiner: '',
    testDate: today,
    disability: '',
    memo: '',
    ...initialInfo,
  });

  function set(key) {
    return e => setInfo(prev => ({ ...prev, [key]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!info.name.trim()) {
      alert('피검자 이름을 입력해주세요.');
      return;
    }
    onNext(info);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-xl leading-none">←</button>
          <div>
            <h1 className="text-base font-bold text-slate-800">기본 정보 입력</h1>
            <p className="text-xs text-slate-400">1단계 / 3단계</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* 피검자 정보 */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center font-bold">1</span>
            피검자 정보
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="이름" required>
              <input className={inputClass} value={info.name} onChange={set('name')} placeholder="홍길동" />
            </Field>
            <Field label="성별">
              <div className="flex gap-2 mt-1">
                {[['M', '남'], ['F', '여']].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={val}
                      checked={info.gender === val}
                      onChange={set('gender')}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </Field>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">생년월일</label>
            <div className="flex gap-2 items-center">
              <input className={`${inputClass} w-24`} placeholder="년(4자리)" value={info.birthYear} onChange={set('birthYear')} maxLength={4} />
              <input className={`${inputClass} w-16`} placeholder="월" value={info.birthMonth} onChange={set('birthMonth')} maxLength={2} />
              <input className={`${inputClass} w-16`} placeholder="일" value={info.birthDay} onChange={set('birthDay')} maxLength={2} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="거주지">
              <input className={inputClass} value={info.address} onChange={set('address')} placeholder="서울시 강남구" />
            </Field>
            <Field label="학교/직업">
              <input className={inputClass} value={info.school || info.occupation} onChange={set('school')} placeholder="OO초등학교" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="학년/반">
              <input className={inputClass} value={info.grade} onChange={set('grade')} placeholder="3학년 2반" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="MA (정신연령)">
              <input className={inputClass} value={info.ma} onChange={set('ma')} placeholder="예: 7.5" />
            </Field>
            <Field label="IQ">
              <input className={inputClass} value={info.iq} onChange={set('iq')} placeholder="예: 85" />
            </Field>
          </div>

          <Field label="장애">
            <input className={inputClass} value={info.disability} onChange={set('disability')} placeholder="예: 지적장애 2급" />
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="developmentalDelay"
              checked={!!info.developmentalDelay}
              onChange={e => setInfo(prev => ({ ...prev, developmentalDelay: e.target.checked }))}
              className="accent-blue-600 w-4 h-4"
            />
            <label htmlFor="developmentalDelay" className="text-sm text-slate-700 cursor-pointer">
              발달지연 아동 <span className="text-xs text-slate-400">(기저선·한계점 5연속 기준 적용)</span>
            </label>
          </div>
        </section>

        {/* 보호자 정보 */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded text-xs flex items-center justify-center font-bold">2</span>
            보호자 정보
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="아버지 직업">
              <input className={inputClass} value={info.fatherJob} onChange={set('fatherJob')} placeholder="직업" />
            </Field>
            <Field label="아버지 최종학력">
              <input className={inputClass} value={info.fatherEdu} onChange={set('fatherEdu')} placeholder="대학교 졸업" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="어머니 직업">
              <input className={inputClass} value={info.motherJob} onChange={set('motherJob')} placeholder="직업" />
            </Field>
            <Field label="어머니 최종학력">
              <input className={inputClass} value={info.motherEdu} onChange={set('motherEdu')} placeholder="대학교 졸업" />
            </Field>
          </div>
        </section>

        {/* 검사 정보 */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="w-5 h-5 bg-green-100 text-green-600 rounded text-xs flex items-center justify-center font-bold">3</span>
            검사 정보
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="면접자">
              <input className={inputClass} value={info.examiner} onChange={set('examiner')} placeholder="검사자 이름" />
            </Field>
            <Field label="검사일">
              <input type="date" className={inputClass} value={info.testDate} onChange={set('testDate')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="피면접자">
              <input className={inputClass} value={info.interviewee} onChange={set('interviewee')} placeholder="어머니, 본인 등" />
            </Field>
            <Field label="피검자와의 관계">
              <input className={inputClass} value={info.relationship} onChange={set('relationship')} placeholder="모, 부, 본인" />
            </Field>
          </div>

          <Field label="비고">
            <textarea
              className={`${inputClass} resize-none`}
              rows={2}
              value={info.memo}
              onChange={set('memo')}
              placeholder="특이사항 등"
            />
          </Field>
        </section>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-sm"
        >
          검사 시작하기 →
        </button>
      </form>
    </div>
  );
}
