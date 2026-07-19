import { useState } from 'react';

export default function StartPage({ onNew, onResume }) {
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sms_records') || '[]');
    } catch {
      return [];
    }
  });

  function deleteRecord(id) {
    if (!confirm('이 기록을 삭제하시겠습니까?')) return;
    const updated = records.filter(r => r.id !== id);
    localStorage.setItem('sms_records', JSON.stringify(updated));
    setRecords(updated);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">사회성숙도 검사</h1>
            <p className="text-xs text-slate-500 mt-0.5">Social Maturity Scale · 김승국·김옥기</p>
          </div>
          <button
            onClick={onNew}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            + 새 검사
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-slate-500 text-sm mb-6">아직 검사 기록이 없습니다</p>
            <button
              onClick={onNew}
              className="bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              첫 검사 시작하기
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-3">검사 기록 {records.length}건</p>
            <div className="space-y-3">
              {records.slice().reverse().map(record => (
                <div key={record.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 truncate">
                          {record.info?.name || '이름 없음'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {record.info?.gender === 'M' ? '남' : record.info?.gender === 'F' ? '여' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        검사일: {record.info?.testDate || '-'} &nbsp;·&nbsp; 면접자: {record.info?.examiner || '-'}
                      </p>
                    </div>

                    {record.result && (
                      <div className="flex gap-3 ml-3 shrink-0">
                        <div className="text-center">
                          <p className="text-xs text-slate-400">SA</p>
                          <p className="text-sm font-bold text-blue-600">{record.result.saStr}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-400">SQ</p>
                          <p className={`text-sm font-bold ${
                            (record.result.sq || 0) >= 90 ? 'text-green-600' :
                            (record.result.sq || 0) >= 70 ? 'text-yellow-600' : 'text-red-500'
                          }`}>
                            {record.result.sq ?? '-'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onResume(record)}
                      className="flex-1 text-sm text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 transition-colors"
                    >
                      {record.result ? '결과 보기' : '이어서 검사'}
                    </button>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-sm text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
