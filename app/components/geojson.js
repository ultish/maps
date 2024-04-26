import turf from '@turf/turf';

export function fixAntimeridianSplit(geojson) {
  // Handle FeatureCollection
  if (geojson.type === 'FeatureCollection') {
    return turf.featureCollection(
      geojson.features.map((feature) => fixAntimeridianSplit(feature)),
    );
  }

  // Ensure we are dealing with a Polygon or LineString feature
  if (
    geojson.type !== 'Feature' ||
    !['Polygon', 'LineString'].includes(geojson.geometry.type)
  ) {
    throw new Error(
      'Input must be a GeoJSON Feature or FeatureCollection with Polygon or LineString geometry',
    );
  }

  // Get the coordinates of the geometry
  const coordinates = geojson.geometry.coordinates;

  // Check if any line segment crosses the antimeridian
  let crossesAntimeridian = false;
  for (let i = 0; i < coordinates.length; i++) {
    const coords =
      geojson.geometry.type === 'Polygon' ? coordinates[i] : coordinates; // Handle nested arrays for Polygons

    for (let j = 0; j < coords.length - 1; j++) {
      const currentLng = coords[j][0];
      const nextLng = coords[j + 1][0];
      if (Math.abs(nextLng - currentLng) > 180) {
        crossesAntimeridian = true;
        break;
      }
    }

    if (crossesAntimeridian) break; // No need to check further
  }

  if (crossesAntimeridian) {
    // Create a clone of the GeoJSON to modify
    const fixedGeoJSON = turf.clone(geojson);
    const fixedCoords = fixedGeoJSON.geometry.coordinates;

    // Iterate through each coordinate pair and adjust longitudes
    for (let i = 0; i < fixedCoords.length; i++) {
      const coords =
        fixedGeoJSON.geometry.type === 'Polygon' ? fixedCoords[i] : fixedCoords; // Handle nested arrays for Polygons

      for (let j = 0; j < coords.length - 1; j++) {
        const currentLng = coords[j][0];
        const nextLng = coords[j + 1][0];

        if (Math.abs(nextLng - currentLng) > 180) {
          const offset = nextLng > currentLng ? -360 : 360;
          coords[j + 1][0] += offset;
        }
      }
    }

    return fixedGeoJSON;
  } else {
    // No need to fix, return the original GeoJSON
    return geojson;
  }
}

export function fixAntimeridianSplit3(geojson, simplifyThreshold = 0) {
  // Handle FeatureCollection
  if (geojson.type === 'FeatureCollection') {
    return turf.featureCollection(
      geojson.features.map((feature) =>
        fixAntimeridianSplit3(feature, simplifyThreshold),
      ),
    );
  }

  // Ensure we are dealing with a Polygon, LineString, or MultiLineString feature
  if (
    geojson.type !== 'Feature' ||
    !['Polygon', 'LineString', 'MultiLineString'].includes(
      geojson.geometry.type,
    )
  ) {
    throw new Error(
      'Input must be a GeoJSON Feature or FeatureCollection with Polygon, LineString, or MultiLineString geometry',
    );
  }

  // Get the coordinates of the geometry
  const coordinates = geojson.geometry.coordinates;

  // Check if any line segment crosses the antimeridian
  let crossesAntimeridian = false;
  for (let i = 0; i < coordinates.length; i++) {
    const coords = getCoordsForGeometryType(geojson, i);

    for (let j = 0; j < coords.length - 1; j++) {
      const currentLng = coords[j][0];
      const nextLng = coords[j + 1][0];
      if (Math.abs(nextLng - currentLng) > 180) {
        crossesAntimeridian = true;
        break;
      }
    }

    if (crossesAntimeridian) break; // No need to check further
  }

  if (crossesAntimeridian) {
    // Create a clone of the GeoJSON to modify
    var fixedGeoJSON = turf.clone(geojson);

    if (simplifyThreshold !== 0) {
      var options = { tolerance: simplifyThreshold, highQuality: false };
      // we can run simplify on the polygons!
      // TODO check out what else turf.js can do
      fixedGeoJSON = turf.simplify(fixedGeoJSON, options);

      console.log(geojson, fixedGeoJSON);
    }

    const fixedCoords = fixedGeoJSON.geometry.coordinates;

    // Iterate through each coordinate pair and adjust longitudes
    for (let i = 0; i < fixedCoords.length; i++) {
      const coords = getCoordsForGeometryType(fixedGeoJSON, i);

      for (let j = 0; j < coords.length - 1; j++) {
        const currentLng = coords[j][0];
        const nextLng = coords[j + 1][0];

        if (Math.abs(nextLng - currentLng) > 180) {
          const offset = nextLng > currentLng ? -360 : 360;
          coords[j + 1][0] += offset;
        }
      }
    }

    return fixedGeoJSON;
  } else {
    // No need to fix, return the original GeoJSON
    return geojson;
  }
}

function getCoordsForGeometryType(geojson, index) {
  if (geojson.geometry.type === 'Polygon') {
    return geojson.geometry.coordinates[index];
  } else if (geojson.geometry.type === 'LineString') {
    return geojson.geometry.coordinates;
  } else if (geojson.geometry.type === 'MultiLineString') {
    return geojson.geometry.coordinates[index];
  }
}
