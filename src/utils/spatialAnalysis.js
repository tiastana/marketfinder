import * as turf from '@turf/turf';

export function toPointFeatures(items) {
  const features = items.map((item) =>
    turf.point([item.lon, item.lat], { ...item })
  );
  return turf.featureCollection(features);
}

export function createBufferFromLatLon(lat, lon, radiusMeters) {
  const pt = turf.point([lon, lat]);
  const buffer = turf.buffer(pt, radiusMeters / 1000, { units: 'kilometers' });
  return buffer;
}

export function countPointsInPolygon(pointFeatureCollection, polygon) {
  let count = 0;
  for (const feature of pointFeatureCollection.features) {
    if (turf.booleanPointInPolygon(feature, polygon)) {
      count += 1;
    }
  }
  return count;
}

export function highestRoadClassInPolygon(roadFeatureCollection, polygon) {
  const classPriority = {
    arterial: 4,
    collector: 3,
    local: 2,
    neighborhood: 1,
  };

  let highest = null;
  let highestPriority = -1;

  for (const feature of roadFeatureCollection.features) {
    if (turf.booleanPointInPolygon(feature, polygon)) {
      const cls = feature.properties.class;
      const pri = classPriority[cls] ?? -1;
      if (pri > highestPriority) {
        highestPriority = pri;
        highest = cls;
      }
    }
  }
  return highest;
}