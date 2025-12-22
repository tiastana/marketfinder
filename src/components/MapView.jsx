import { MapContainer, TileLayer, Marker, CircleMarker, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';

const defaultIcon = L.icon({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView({
  activities,
  competitors,
  roads,
  bufferPolygon,
  selectedLocation,
  onMapClick,
}) {
  const center = selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : [-7.8, 110.36];

  // Force GeoJSON to re-render when the selection changes
  const bufferKey = selectedLocation ? `${selectedLocation.lat.toFixed(6)},${selectedLocation.lon.toFixed(6)}` : 'none';

  // Recenter map when user selects a new location
  function RecenterOnSelect({ coords }) {
    const map = useMap();
    if (coords) {
      map.setView(coords);
    }
    return null;
  }

  // Show data only when a buffer exists; filter using Turf
  const displayedCompetitors = bufferPolygon
    ? competitors.filter((c) => {
        const pt = turf.point([c.lon, c.lat]);
        return turf.booleanPointInPolygon(pt, bufferPolygon);
      })
    : [];

  const displayedActivities = bufferPolygon
    ? activities.filter((a) => {
        const pt = turf.point([a.lon, a.lat]);
        return turf.booleanPointInPolygon(pt, bufferPolygon);
      })
    : [];

  const displayedRoads = bufferPolygon
    ? roads.filter((r) => {
        const pt = turf.point([r.lon, r.lat]);
        return turf.booleanPointInPolygon(pt, bufferPolygon);
      })
    : [];

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onClick={onMapClick} />
      <RecenterOnSelect coords={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : null} />

      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lon]} icon={defaultIcon} />
      )}

      {bufferPolygon && (
        <GeoJSON
          key={bufferKey}
          data={bufferPolygon}
          style={{ color: '#1f77b4', weight: 2, fillOpacity: 0.2 }}
        />
      )}

      {/* Render ONLY features inside buffer and ONLY when buffer exists */}
      {bufferPolygon &&
        displayedCompetitors.map((c, idx) => (
          <CircleMarker key={`comp-${idx}`} center={[c.lat, c.lon]} radius={5} pathOptions={{ color: '#d62728' }}>
          </CircleMarker>
        ))}

      {bufferPolygon &&
        displayedActivities.map((a, idx) => (
          <CircleMarker key={`act-${idx}`} center={[a.lat, a.lon]} radius={5} pathOptions={{ color: '#2ca02c' }}>
          </CircleMarker>
        ))}

      {bufferPolygon &&
        displayedRoads.map((r, idx) => (
          <CircleMarker key={`rd-${idx}`} center={[r.lat, r.lon]} radius={3} pathOptions={{ color: '#7f7f7f' }}>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}