export default function ScoreCard({
  competitorScore,
  activityScore,
  roadScore,
  finalScore,
  normalized,
  classification,
}) {
  return (
    <div>
      <h3 style={{ margin: '4px 0 12px' }}>Location Potential Score</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div><strong>Competitors Score:</strong> {competitorScore}</div>
        <div><strong>Activity Centers Score:</strong> {activityScore}</div>
        <div><strong>Road Class Score:</strong> {roadScore}</div>
        <div><strong>Weighted Score:</strong> {finalScore.toFixed(2)}</div>
      </div>
      <div style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', background: '#f9fafb' }}>
        <div style={{ fontSize: 24, fontWeight: 600 }}>Normalized: {normalized.toFixed(0)} / 100</div>
        <div style={{ fontSize: 18, marginTop: 6 }}>
          Classification: <span style={{ fontWeight: 600 }}>{classification}</span>
        </div>
        <div style={{ fontSize: 12, color: '#555', marginTop: 8 }}>
          finalScore = (0.3 × competitorScore) + (0.4 × activityScore) + (0.3 × roadScore).
          Normalized to 0–100 assuming max weighted score of 5.
        </div>
      </div>
    </div>
  );
}