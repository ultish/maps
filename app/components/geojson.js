import turf from '@turf/turf';
import proj from 'ol/proj';

// export function fixAntimeridianSplit(geojson) {
//   // Handle FeatureCollection
//   if (geojson.type === 'FeatureCollection') {
//     return turf.featureCollection(
//       geojson.features.map((feature) => fixAntimeridianSplit(feature)),
//     );
//   }

//   // Ensure we are dealing with a Polygon or LineString feature
//   if (
//     geojson.type !== 'Feature' ||
//     !['Polygon', 'LineString'].includes(geojson.geometry.type)
//   ) {
//     throw new Error(
//       'Input must be a GeoJSON Feature or FeatureCollection with Polygon or LineString geometry',
//     );
//   }

//   // Get the coordinates of the geometry
//   const coordinates = geojson.geometry.coordinates;

//   // Check if any line segment crosses the antimeridian
//   let crossesAntimeridian = false;
//   for (let i = 0; i < coordinates.length; i++) {
//     const coords =
//       geojson.geometry.type === 'Polygon' ? coordinates[i] : coordinates; // Handle nested arrays for Polygons

//     for (let j = 0; j < coords.length - 1; j++) {
//       const currentLng = coords[j][0];
//       const nextLng = coords[j + 1][0];
//       if (Math.abs(nextLng - currentLng) > 180) {
//         crossesAntimeridian = true;
//         break;
//       }
//     }

//     if (crossesAntimeridian) break; // No need to check further
//   }

//   if (crossesAntimeridian) {
//     // Create a clone of the GeoJSON to modify
//     const fixedGeoJSON = turf.clone(geojson);
//     const fixedCoords = fixedGeoJSON.geometry.coordinates;

//     // Iterate through each coordinate pair and adjust longitudes
//     for (let i = 0; i < fixedCoords.length; i++) {
//       const coords =
//         fixedGeoJSON.geometry.type === 'Polygon' ? fixedCoords[i] : fixedCoords; // Handle nested arrays for Polygons

//       for (let j = 0; j < coords.length - 1; j++) {
//         const currentLng = coords[j][0];
//         const nextLng = coords[j + 1][0];

//         if (Math.abs(nextLng - currentLng) > 180) {
//           const offset = nextLng > currentLng ? -360 : 360;
//           coords[j + 1][0] += offset;
//         }
//       }
//     }

//     return fixedGeoJSON;
//   } else {
//     // No need to fix, return the original GeoJSON
//     return geojson;
//   }
// }

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

    console.log(splitAtDateLine(coords));

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

function splitAtDateLine(coords) {
  const lineStrings = [];
  let lastX = Infinity;
  let lineString;
  for (let i = 0, ii = coords.length; i < ii; ++i) {
    const coord = coords[i];
    const x = coord[0];
    if (Math.abs(lastX - x) > 180) {
      // Crossing date line will be shorter
      if (lineString) {
        const prevCoord = coords[i - 1];
        const w1 = 180 - Math.abs(lastX);
        const w2 = 180 - Math.abs(x);
        const y = (w1 / (w1 + w2)) * (coord[1] - prevCoord[1]) + prevCoord[1];
        if (Math.abs(lastX) !== 180) {
          lineString.push(proj.fromLonLat([lastX > 0 ? 180 : -180, y]));
        }
        lineStrings.push((lineString = []));
        if (Math.abs(x) !== 180) {
          lineString.push(proj.fromLonLat([x > 0 ? 180 : -180, y]));
        }
      } else {
        lineStrings.push((lineString = []));
      }
    }
    lastX = x;
    lineString.push(proj.fromLonLat(coord));
  }
  return lineStrings;
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
