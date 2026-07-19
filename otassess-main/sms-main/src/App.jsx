import { useState } from 'react';
import StartPage from './pages/StartPage';
import InfoPage from './pages/InfoPage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import { computeResult } from './utils/scoring';
import { AGE_GROUPS } from './data/testItems';

export default function App() {
  const [page, setPage] = useState('start');
  const [currentRecord, setCurrentRecord] = useState(null);

  function startNew() {
    setCurrentRecord({ id: Date.now(), info: {}, scores: {}, result: null });
    setPage('info');
  }

  function resumeRecord(record) {
    setCurrentRecord(record);
    setPage(record.result ? 'result' : 'test');
  }

  function handleInfoNext(info) {
    setCurrentRecord(prev => ({ ...prev, info }));
    setPage('test');
  }

  function calcCAYearsMonths(info) {
    if (!info.birthYear) return [0, 0];
    const birth = new Date(
      `${info.birthYear}-${String(info.birthMonth || 1).padStart(2, '0')}-${String(info.birthDay || 1).padStart(2, '0')}`
    );
    const test = new Date(info.testDate || Date.now());
    const diffYears = (test - birth) / (1000 * 60 * 60 * 24 * 365.25);
    return [Math.floor(diffYears), Math.round((diffYears % 1) * 12)];
  }

  function handleTestComplete(scores, startGroupIdx) {
    const [caYears, caMonths] = calcCAYearsMonths(currentRecord.info);
    const startItemId = (startGroupIdx != null) ? (AGE_GROUPS[startGroupIdx]?.range[0] ?? 0) : 0;
    const threshold = currentRecord.info?.developmentalDelay ? 5 : 3;
    const result = computeResult(scores, caYears, caMonths, startItemId, threshold);
    const updated = { ...currentRecord, scores, result, startGroupIdx };
    setCurrentRecord(updated);
    saveRecord(updated);
    setPage('result');
  }

  function saveRecord(record) {
    try {
      const records = JSON.parse(localStorage.getItem('sms_records') || '[]');
      const idx = records.findIndex(r => r.id === record.id);
      if (idx >= 0) records[idx] = record;
      else records.push(record);
      localStorage.setItem('sms_records', JSON.stringify(records));
    } catch (e) {
      console.error('저장 실패:', e);
    }
  }

  if (page === 'start') return <StartPage onNew={startNew} onResume={resumeRecord} />;
  if (page === 'info')  return <InfoPage initialInfo={currentRecord?.info} onNext={handleInfoNext} onBack={() => setPage('start')} />;
  if (page === 'test')  return <TestPage info={currentRecord?.info} initialScores={currentRecord?.scores} initialStartGroupIdx={currentRecord?.startGroupIdx} onComplete={handleTestComplete} onBack={() => setPage('info')} />;
  if (page === 'result') return <ResultPage info={currentRecord?.info} result={currentRecord?.result} scores={currentRecord?.scores} onBack={() => setPage('start')} onEdit={() => setPage('test')} onSaveRecord={() => saveRecord(currentRecord)} />;
  return null;
}
