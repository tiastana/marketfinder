import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function AnalysisPanel({ competitorCount, activityCount, highestRoadClass }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Competitors', 'Activity Centers'],
        datasets: [
          {
            label: 'Count in 300 m Buffer',
            data: [competitorCount, activityCount],
            backgroundColor: ['#d62728', '#2ca02c'],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true },
        },
      },
    });
  }, [competitorCount, activityCount]);

  return (
    <div>
      <h3 style={{ margin: '4px 0 12px' }}>Spatial Analysis (300 m buffer)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
        <div>
          <canvas ref={canvasRef} height="160" />
        </div>
        <div>
          <div><strong>Highest Road Class in Buffer:</strong> {highestRoadClass || 'None detected'}</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 8 }}>
            Counts and classification are computed client-side using Turf.js point-in-polygon over a 300 m buffer.
          </div>
        </div>
      </div>
    </div>
  );
}