import { useState, useRef, useEffect, useMemo } from 'react';
import { TEST_ITEMS, AGE_GROUPS, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/testItems';
import { findBasal, findCeiling } from '../utils/scoring';

const SCORE_OPTIONS = [
  { value: '+',   label: '+',   title: '습관적 수행',              color: 'bg-green-500 text-white border-green-500' },
  { value: '+F',  label: '+F',  title: '제약으로 못하나 평상시 수행', color: 'bg-emerald-400 text-white border-emerald-400' },
  { value: '+NO', label: '+NO', title: '기회 부족이나 곧 수행 가능',  color: 'bg-teal-400 text-white border-teal-400' },
  { value: '±',   label: '±',   title: '불안정·과도기 상태',         color: 'bg-amber-400 text-white border-amber-400' },
  { value: '-',   label: '−',   title: '미수행 또는 강요에 의한 수행', color: 'bg-slate-300 text-slate-600 border-slate-300' },
];

function ScoreButtons({ value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {SCORE_OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          title={opt.title}
          onClick={() => onChange(opt.value)}
          className={`
            min-w-[40px] h-9 rounded-lg text-sm font-bold border-2 transition-all active:scale-95
            ${value === opt.value
              ? opt.color
              : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ItemCard({ item, score, onChange, isPrevZone, isBasalZone, isCeiling }) {
  return (
    <div className={`
      rounded-xl border p-4 transition-all
      ${isCeiling ? 'border-red-300 bg-red-50' :
        isBasalZone ? 'border-green-200 bg-green-50' :
        isPrevZone ? 'border-slate-100 bg-slate-50 opacity-75' :
        score === '-' ? 'bg-slate-50 border-slate-200' :
        score ? 'bg-white border-blue-200 shadow-sm' :
        'bg-white border-slate-200'
      }
    `}>
      <div className="flex items-start gap-3">
        <span className="text-xs text-slate-400 font-mono mt-0.5 shrink-0 w-6 text-right">{item.id}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[item.category]}`}>
              {item.category}
            </span>
            <span className="text-[10px] text-slate-400">{CATEGORY_LABELS[item.category]}</span>
            <span className="text-[10px] text-slate-400">({item.ageEquiv}세)</span>
            {isBasalZone && (
              <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded ml-auto">✓ 기저선</span>
            )}
            {isCeiling && (
              <span className="text-[10px] font-semibold text-red-700 bg-red-100 px-1.5 py-0.5 rounded ml-auto">● 한계점</span>
            )}
            {isPrevZone && !isBasalZone && (
              <span className="text-[10px] text-slate-400 ml-auto">이전 구간</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-800 leading-snug">{item.text}</p>
          {item.desc && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
          )}
          <div className="mt-3">
            <ScoreButtons value={score} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

function calcCA(info) {
  if (!info?.birthYear) return null;
  const birth = new Date(
    `${info.birthYear}-${String(info.birthMonth || 1).padStart(2, '0')}-${String(info.birthDay || 1).padStart(2, '0')}`
  );
  const test = new Date(info?.testDate || Date.now());
  const diff = (test - birth) / (1000 * 60 * 60 * 24 * 365.25);
  const y = Math.floor(diff);
  const m = Math.round((diff % 1) * 12);
  return `${y}세 ${m}개월`;
}

export default function TestPage({ info, initialScores, initialStartGroupIdx, onComplete, onBack }) {
  const [scores, setScores] = useState(initialScores || {});
  const [startGroupIdx, setStartGroupIdx] = useState(initialStartGroupIdx ?? null);
  const [activeGroupIdx, setActiveGroupIdx] = useState(startGroupIdx ?? 0);
  const [showLegend, setShowLegend] = useState(false);
  const groupRefs = useRef({});

  const threshold = info?.developmentalDelay ? 5 : 3;
  const startItemId = startGroupIdx !== null ? (AGE_GROUPS[startGroupIdx]?.range[0] ?? 0) : 0;
  const caStr = useMemo(() => calcCA(info), [info]);

  // 실시간 기저선·한계점 탐지
  const currentBasalId = useMemo(() => findBasal(scores, threshold), [scores, threshold]);
  const currentCeilingId = useMemo(() => findCeiling(scores, threshold), [scores, threshold]);
  const basalConfirmed = currentBasalId > 0;
  const ceilingReached = currentCeilingId !== null;

  // 진행률 (시작문항 이전 자동통과 포함)
  const autoCount = startItemId > 0 ? startItemId - 1 : 0;
  const itemsToScore = startItemId > 0 ? TEST_ITEMS.filter(i => i.id >= startItemId) : TEST_ITEMS;
  const scoredCount = itemsToScore.filter(i => scores[i.id]).length;
  const pct = Math.round(((autoCount + scoredCount) / TEST_ITEMS.length) * 100);

  function setScore(itemId, value) {
    setScores(prev => {
      const next = { ...prev };
      if (next[itemId] === value) delete next[itemId];
      else next[itemId] = value;
      return next;
    });
  }

  function handleSetStart(idx) {
    setStartGroupIdx(prev => (prev === idx ? null : idx));
  }

  function scrollToGroup(idx) {
    setActiveGroupIdx(idx);
    const el = groupRefs.current[idx];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleDone() {
    const unscored = itemsToScore.filter(i => !scores[i.id]).length;
    if (unscored > 0) {
      if (!confirm(`아직 채점되지 않은 문항이 ${unscored}개 있습니다.\n계속 결과를 산출하시겠습니까?`)) return;
    }
    onComplete(scores, startGroupIdx);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveGroupIdx(Number(entry.target.dataset.groupIdx));
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    Object.values(groupRefs.current).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-xl leading-none">←</button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800 truncate">{info?.name || ''} 검사</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLegend(v => !v)}
                  className="text-xs text-slate-400 hover:text-slate-600 border border-slate-200 rounded px-2 py-0.5"
                >
                  채점기호
                </button>
                <button
                  onClick={handleDone}
                  className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  결과 산출
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {autoCount > 0 ? `${autoCount}+${scoredCount}` : scoredCount}/117
              </span>
            </div>
          </div>
        </div>

        {showLegend && (
          <div className="bg-slate-50 rounded-lg p-3 mt-1 space-y-1.5">
            {SCORE_OPTIONS.map(opt => (
              <div key={opt.value} className="flex items-center gap-2 text-xs">
                <span className={`w-8 text-center font-bold py-0.5 rounded ${opt.color}`}>{opt.label}</span>
                <span className="text-slate-600">{opt.title}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-28 shrink-0 bg-white border-r border-slate-200 sticky top-[57px] self-start h-[calc(100vh-57px)] overflow-y-auto flex flex-col">

          {/* 피검자 기본정보 */}
          <div className="px-2 py-2.5 border-b border-slate-100 bg-slate-50 shrink-0">
            <p className="text-[11px] font-bold text-slate-700 truncate">{info?.name || '-'}</p>
            {caStr && <p className="text-[10px] text-slate-500 mt-0.5">CA {caStr}</p>}
            {info?.testDate && <p className="text-[10px] text-slate-400">{info.testDate}</p>}
            {info?.developmentalDelay && (
              <p className="text-[10px] text-purple-600 font-semibold mt-0.5">발달지연 (5연속)</p>
            )}
            {startGroupIdx !== null && (
              <p className="text-[10px] text-orange-600 font-semibold mt-0.5">
                ▶ {AGE_GROUPS[startGroupIdx]?.label} 시작
              </p>
            )}
          </div>

          {/* 검사 상태 */}
          <div className="px-2 py-2 border-b border-slate-100 shrink-0">
            <p className="text-[9px] text-slate-400 font-semibold uppercase mb-1.5">검사 상태</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${basalConfirmed ? 'bg-green-500' : 'bg-slate-300'}`} />
                <span className="text-[10px] text-slate-600 leading-tight">
                  기저선: {basalConfirmed ? `${currentBasalId}번까지` : '미확정'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ceilingReached ? 'bg-red-500' : 'bg-slate-300'}`} />
                <span className="text-[10px] text-slate-600 leading-tight">
                  한계점: {ceilingReached ? `${currentCeilingId}번` : '미도달'}
                </span>
              </div>
            </div>
          </div>

          {/* 연령 구간 목록 */}
          <div className="flex-1 py-1 overflow-y-auto">
            {AGE_GROUPS.map((g, idx) => {
              const [start, end] = g.range;
              const groupItems = TEST_ITEMS.filter(i => i.id >= start && i.id <= end);
              const isPrev = startGroupIdx !== null && idx < startGroupIdx;
              const scoredInGroup = groupItems.filter(i => scores[i.id]).length;
              const allDone = isPrev || scoredInGroup === groupItems.length;
              const isActive = activeGroupIdx === idx;
              const isStart = startGroupIdx === idx;

              return (
                <div
                  key={idx}
                  className={`relative flex items-center cursor-pointer transition-all ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  onClick={() => scrollToGroup(idx)}
                >
                  {isActive && <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-600 rounded-r" />}
                  <div className="flex-1 px-3 py-2">
                    <span className={`block text-xs font-semibold leading-tight ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                      {g.label}
                    </span>
                    <span className={`block text-[10px] mt-0.5 ${isPrev ? 'text-slate-400' : allDone ? 'text-green-500 font-medium' : 'text-slate-400'}`}>
                      {isPrev ? '이전 구간' : allDone ? '✓ 완료' : `${scoredInGroup}/${groupItems.length}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    title={isStart ? '시작 위치 해제' : '여기서 시작'}
                    className={`mr-1.5 w-5 h-5 flex items-center justify-center rounded text-[11px] transition-colors shrink-0
                      ${isStart ? 'text-orange-500 bg-orange-50' : 'text-slate-300 hover:text-orange-400'}`}
                    onClick={e => { e.stopPropagation(); handleSetStart(idx); }}
                  >
                    ▶
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 메인 */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6">

          {/* 한계점 도달 배너 */}
          {ceilingReached && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 sticky top-2 z-10">
              <span className="text-red-500 text-base shrink-0">⚠</span>
              <div>
                <p className="text-xs font-bold text-red-700">한계점 도달 — 검사 종료</p>
                <p className="text-[10px] text-red-500">
                  {currentCeilingId}번에서 {threshold}연속 미수행 확인. 이후 문항은 채점하지 않습니다.
                </p>
              </div>
            </div>
          )}

          {/* 기저선 확정 배너 */}
          {basalConfirmed && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <span className="text-green-500 text-base shrink-0">✓</span>
              <div>
                <p className="text-xs font-bold text-green-700">기저선 확정</p>
                <p className="text-[10px] text-green-600">
                  {currentBasalId}번까지 {threshold}연속 '+'/'+F' 확인 — 이전 문항 기본점 처리
                </p>
              </div>
            </div>
          )}

          {AGE_GROUPS.map((group, idx) => {
            const [start, end] = group.range;
            const groupItems = TEST_ITEMS.filter(i => i.id >= start && i.id <= end);
            const isPrevGroup = startGroupIdx !== null && idx < startGroupIdx;
            const scoredInGroup = groupItems.filter(i => scores[i.id]).length;

            return (
              <section
                key={idx}
                data-group-idx={idx}
                ref={el => { groupRefs.current[idx] = el; }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-bold text-slate-700">{group.label} 구간</h2>
                  {isPrevGroup
                    ? <span className="text-xs text-slate-400">이전 구간</span>
                    : (
                      <>
                        <span className="text-xs text-slate-400">{scoredInGroup}/{groupItems.length}</span>
                        {scoredInGroup === groupItems.length && (
                          <span className="text-xs text-green-600 font-medium">✓ 완료</span>
                        )}
                      </>
                    )
                  }
                </div>
                <div className="space-y-3">
                  {groupItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      score={scores[item.id]}
                      onChange={val => setScore(item.id, val)}
                      isPrevZone={isPrevGroup}
                      isBasalZone={item.id <= currentBasalId && currentBasalId > 0}
                      isCeiling={currentCeilingId !== null && item.id === currentCeilingId}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <div className="pb-8">
            <button
              onClick={handleDone}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-sm"
            >
              결과 산출하기 →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
