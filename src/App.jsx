import { useMemo, useState } from 'react';
import MapView from './components/MapView.jsx';
import AnalysisPanel from './components/AnalysisPanel.jsx';
import ScoreCard from './components/ScoreCard.jsx';
import './App.css';
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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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
    setIsPanelOpen(true);

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

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="app-container">
      <div className="map-container">
        <button
          className="toggle-btn"
          onClick={togglePanel}
          title={isPanelOpen ? "Hide Analysis" : "Show Analysis"}
        >
          {/* Simple Icon: Graph if closed, Close/Arrow if open */}
          {isPanelOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          )}
        </button>
        <MapView
          activities={activitiesData}
          competitors={competitorsData}
          roads={roadsData}
          bufferPolygon={bufferPolygon}
          selectedLocation={selectedLocation}
          onMapClick={handleMapClick}
        />
      </div>
      
      <div className={`sidebar ${isPanelOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <div className="panel-card">
            <AnalysisPanel
              competitorCount={analysis.competitorCount}
              activityCount={analysis.activityCount}
              highestRoadClass={analysis.highestRoadClass}
            />
          </div>
          <div className="panel-card">
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
    </div>
  );
}