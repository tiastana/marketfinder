import { useMemo, useState } from 'react';
import MapView from './components/MapView.jsx';
import AnalysisPanel from './components/AnalysisPanel.jsx';
import ScoreCard from './components/ScoreCard.jsx';
import {
  toPointFeatures,
  createBufferFromLatLon,
  countPointsInPolygon,
  highestRoadClassInPolygon,
} from './utils/spatialAnalysis.js';
import {
  scoreCompetitors,
  scoreActivities,
  scoreRoadClass,
  computeFinalScore,
  normalizeScoreTo100,
  classifyPotential,
} from './utils/scoring.js';
import activitiesData from './data/activities.json';
import competitorsData from './data/competitors.json';
import roadsData from './data/roads.json';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bufferPolygon, setBufferPolygon] = useState(null);
  const [analysis, setAnalysis] = useState({
    competitorCount: 0,
    activityCount: 0,
    highestRoadClass: null,
  });
  const [scores, setScores] = useState({
    competitorScore: 0,
    activityScore: 0,
    roadScore: 0,
    finalScore: 0,
    normalized: 0,
    classification: '—',
  });

  const activityPoints = useMemo(() => toPointFeatures(activitiesData), []);
  const competitorPoints = useMemo(() => toPointFeatures(competitorsData), []);
  const roadPoints = useMemo(() => toPointFeatures(roadsData), []);

  const handleMapClick = (lat, lon) => {
    setSelectedLocation({ lat, lon });

    const buffer = createBufferFromLatLon(lat, lon, 300);
    setBufferPolygon(buffer);

    const competitorsIn = countPointsInPolygon(competitorPoints, buffer);
    const activitiesIn = countPointsInPolygon(activityPoints, buffer);
    const highestRoadClass = highestRoadClassInPolygon(roadPoints, buffer);

    setAnalysis({
      competitorCount: competitorsIn,
      activityCount: activitiesIn,
      highestRoadClass,
    });

    const cScore = scoreCompetitors(competitorsIn);
    const aScore = scoreActivities(activitiesIn);
    const rScore = scoreRoadClass(highestRoadClass);

    const final = computeFinalScore(cScore, aScore, rScore);
    const normalized = normalizeScoreTo100(final);
    const classification = classifyPotential(normalized);

    setScores({
      competitorScore: cScore,
      activityScore: aScore,
      roadScore: rScore,
      finalScore: final,
      normalized,
      classification,
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', height: '100vh', padding: '12px', boxSizing: 'border-box' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
        <MapView
          activities={activitiesData}
          competitors={competitorsData}
          roads={roadsData}
          bufferPolygon={bufferPolygon}
          selectedLocation={selectedLocation}
          onMapClick={handleMapClick}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '16px' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
          <AnalysisPanel
            competitorCount={analysis.competitorCount}
            activityCount={analysis.activityCount}
            highestRoadClass={analysis.highestRoadClass}
          />
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
          <ScoreCard
            competitorScore={scores.competitorScore}
            activityScore={scores.activityScore}
            roadScore={scores.roadScore}
            finalScore={scores.finalScore}
            normalized={scores.normalized}
            classification={scores.classification}
          />
        </div>
      </div>
    </div>
  );
}