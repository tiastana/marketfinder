export function scoreCompetitors(count) {
  if (count <= 2) return 2;
  if (count >= 3 && count <= 5) return 5;
  return 3;
}

export function scoreActivities(count) {
  if (count === 0) return 1;
  if (count >= 1 && count <= 2) return 3;
  return 5;
}

export function scoreRoadClass(cls) {
  if (cls === 'arterial') return 5;
  if (cls === 'collector') return 4;
  if (cls === 'local') return 3;
  if (cls === 'neighborhood') return 2;
  return 0;
}

export function computeFinalScore(competitorScore, activityScore, roadScore) {
  return (0.3 * competitorScore) + (0.4 * activityScore) + (0.3 * roadScore);
}

export function normalizeScoreTo100(finalScore) {
  const maxWeighted = 5;
  return Math.max(0, Math.min(100, (finalScore / maxWeighted) * 100));
}

export function classifyPotential(normalized) {
  if (normalized <= 40) return 'Low Potential';
  if (normalized <= 70) return 'Medium Potential';
  return 'High Potential';
}