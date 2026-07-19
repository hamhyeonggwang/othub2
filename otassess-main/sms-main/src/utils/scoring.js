import { TEST_ITEMS } from '../data/testItems';

export const SCORE_WEIGHTS = {
  '+': 1,
  '+F': 1,
  '+NO': 1,
  '±': 0.5,
  '-': 0,
};

export function ageToDecimal(years, months) {
  return Number(years || 0) + Number(months || 0) / 12;
}

export function decimalToAgeStr(decimal) {
  if (!decimal || decimal <= 0) return '-';
  const years = Math.floor(decimal);
  const months = Math.round((decimal - years) * 12);
  if (years === 0) return `${months}개월`;
  if (months === 0) return `${years}세`;
  return `${years}세 ${months}개월`;
}

function isPassScore(s) {
  return s === '+' || s === '+F';
}

/**
 * 기저선(Basal) 탐색
 * threshold개 연속 '+'/'+F' 발견 시 그 직전 문항 ID 반환.
 * 미발견 시 0 반환.
 */
export function findBasal(scores, threshold = 3) {
  let consecutive = 0;
  for (let i = 0; i < TEST_ITEMS.length; i++) {
    if (isPassScore(scores[TEST_ITEMS[i].id])) {
      consecutive++;
      if (consecutive >= threshold) {
        const blockStartIdx = i - threshold + 1;
        return blockStartIdx > 0 ? TEST_ITEMS[blockStartIdx - 1].id : 0;
      }
    } else {
      consecutive = 0;
    }
  }
  return 0;
}

/**
 * 한계점(Ceiling) 탐색
 * threshold개 연속 '-' 발견 시 그 마지막 문항 ID 반환.
 * 미도달 시 null 반환.
 */
export function findCeiling(scores, threshold = 3) {
  let consecutive = 0;
  for (let i = 0; i < TEST_ITEMS.length; i++) {
    if (scores[TEST_ITEMS[i].id] === '-') {
      consecutive++;
      if (consecutive >= threshold) {
        return TEST_ITEMS[i].id;
      }
    } else {
      consecutive = 0;
    }
  }
  return null;
}

export function calculateRawScore(scores, startItemId = 0, threshold = 3) {
  const basalFromScores = findBasal(scores, threshold);
  // 시작 문항 이전 + 연속 통과로 확정된 기저선 중 높은 쪽
  const effectiveBasal = Math.max(basalFromScores, startItemId > 0 ? startItemId - 1 : 0);

  let baseScore = 0;
  let additionalScore = 0;

  for (const item of TEST_ITEMS) {
    if (item.id <= effectiveBasal) {
      baseScore += 1;
    } else {
      const s = scores[item.id];
      additionalScore += SCORE_WEIGHTS[s] || 0;
    }
  }

  return { baseScore, additionalScore, total: baseScore + additionalScore, basalItemId: effectiveBasal };
}

export function calculateSA(rawTotal) {
  const n = TEST_ITEMS.length;
  if (rawTotal <= 0) return 0;
  if (rawTotal >= n) return TEST_ITEMS[n - 1].ageEquiv;

  const lowerIdx = Math.floor(rawTotal) - 1;
  const upperIdx = Math.ceil(rawTotal) - 1;
  const frac = rawTotal - Math.floor(rawTotal);

  if (lowerIdx < 0) return TEST_ITEMS[0].ageEquiv * rawTotal;
  if (upperIdx >= n) return TEST_ITEMS[n - 1].ageEquiv;

  return TEST_ITEMS[lowerIdx].ageEquiv + (TEST_ITEMS[upperIdx].ageEquiv - TEST_ITEMS[lowerIdx].ageEquiv) * frac;
}

export function calculateSQ(sa, caYears, caMonths) {
  const ca = ageToDecimal(caYears, caMonths);
  if (!ca || ca <= 0) return null;
  return Math.round((sa / ca) * 100);
}

export function calculateCategoryScores(scores, startItemId = 0, threshold = 3) {
  const basalFromScores = findBasal(scores, threshold);
  const effectiveBasal = Math.max(basalFromScores, startItemId > 0 ? startItemId - 1 : 0);

  const categories = ['C', 'S', 'SHG', 'SHD', 'SHE', 'L', 'O', 'SD'];
  const result = {};

  for (const cat of categories) {
    const items = TEST_ITEMS.filter(i => i.category === cat);
    let passed = 0;
    const total = items.length;
    for (const item of items) {
      if (item.id <= effectiveBasal) {
        passed += 1;
      } else {
        passed += SCORE_WEIGHTS[scores[item.id]] || 0;
      }
    }
    result[cat] = { passed, total, pct: total > 0 ? Math.round((passed / total) * 100) : 0 };
  }

  return result;
}

export function computeResult(scores, caYears, caMonths, startItemId = 0, threshold = 3) {
  const { baseScore, additionalScore, total, basalItemId } = calculateRawScore(scores, startItemId, threshold);
  const ceilingItemId = findCeiling(scores, threshold);
  const sa = calculateSA(total);
  const sq = calculateSQ(sa, caYears, caMonths);
  const categoryScores = calculateCategoryScores(scores, startItemId, threshold);

  return {
    baseScore: Math.round(baseScore),
    additionalScore: Math.round(additionalScore * 10) / 10,
    total: Math.round(total * 10) / 10,
    sa: Math.round(sa * 100) / 100,
    saStr: decimalToAgeStr(sa),
    sq,
    categoryScores,
    basalItemId,
    ceilingItemId,
    startItemId,
    threshold,
  };
}
