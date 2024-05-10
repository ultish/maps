import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.List;

public class GeoJSONRewind {

    private static final ObjectMapper mapper = new ObjectMapper();

    /**
     * Rewinds the outer ring of LineStrings/MultiLineStrings and Polygons/MultiPolygons counterclockwise
     * and inner rings clockwise using the Shoelace Formula.
     *
     * @param geojson input GeoJSON
     * @param options optional parameters (reverse, mutate)
     * @return rewound GeoJSON
     * @throws Exception for invalid input or options
     */
    public static JsonNode rewind(JsonNode geojson, JsonNode options) throws Exception {
        // Handle options
        boolean reverse = options.has("reverse") && options.get("reverse").asBoolean();
        boolean mutate = options.has("mutate") && options.get("mutate").asBoolean();

        // Validate input
        if (geojson == null || !geojson.isObject()) {
            throw new Exception("Invalid GeoJSON input. Must be an object.");
        }

        // Clone input if not mutating
        if (!mutate && !geojson.has("type") || (!"Point".equals(geojson.get("type").asText()) && !"MultiPoint".equals(geojson.get("type").asText()))) {
            geojson = mapper.treeToValue(geojson, JsonNode.class);
        }

        // Handle different GeoJSON types
        String type = geojson.has("type") ? geojson.get("type").asText() : null;
        switch (type) {
            case "GeometryCollection":
                return rewindGeometryCollection(geojson, reverse);
            case "FeatureCollection":
                return rewindFeatureCollection(geojson, reverse);
            case "Feature":
                return rewindFeature(geojson, reverse);
            default:
                return rewindGeometry(geojson, reverse);
        }
    }

    private static JsonNode rewindGeometryCollection(JsonNode geojson, boolean reverse) throws Exception {
        ArrayNode geometries = (ArrayNode) geojson.get("geometries");
        for (JsonNode geometry : geometries) {
            rewindGeometry(geometry, reverse);
        }
        return geojson;
    }

    private static JsonNode rewindFeatureCollection(JsonNode geojson, boolean reverse) throws Exception {
        ArrayNode features = (ArrayNode) geojson.get("features");
        List<JsonNode> rewoundFeatures = new ArrayList<>();
        for (JsonNode feature : features) {
            JsonNode rewoundFeature = rewindFeature(feature, reverse);
            if (rewoundFeature.has("type") && "FeatureCollection".equals(rewoundFeature.get("type").asText())) {
                // Handle nested FeatureCollections
                ArrayNode nestedFeatures = (ArrayNode) rewoundFeature.get("features");
                rewoundFeatures.addAll(nestedFeatures);
            } else {
                rewoundFeatures.add(rewoundFeature);
            }
        }
        ((ObjectNode) geojson).putArray("features").addAll(rewoundFeatures);
        return geojson;
    }

    private static JsonNode rewindFeature(JsonNode geojson, boolean reverse) throws Exception {
        JsonNode geometry = geojson.get("geometry");
        rewindGeometry(geometry, reverse);
        return geojson;
    }

    private static JsonNode rewindGeometry(JsonNode geojson, boolean reverse) throws Exception {
        String type = geojson.get("type").asText();
        switch (type) {
            case "GeometryCollection":
                return rewindGeometryCollection(geojson, reverse);
            case "LineString":
                rewindLineString((ArrayNode) geojson.get("coordinates"), reverse);
                return geojson;
            case "Polygon":
                rewindPolygon((ArrayNode) geojson.get("coordinates"), reverse);
                return geojson;
            case "MultiLineString":
                ArrayNode lines = (ArrayNode) geojson.get("coordinates");
                for (JsonNode line : lines) {
                    rewindLineString((ArrayNode) line, reverse);
                }
                return geojson;
            case "MultiPolygon":
                ArrayNode polygons = (ArrayNode) geojson.get("coordinates");
                for (JsonNode polygon : polygons) {
                    rewindPolygon((ArrayNode) polygon, reverse);
                }
                return geojson;
            case "Point":
            case "MultiPoint":
                // No need to rewind
                return geojson;
            default:
                throw new Exception("Unsupported geometry type: " + type);
        }
    }

    private static void rewindLineString(ArrayNode coords, boolean reverse) {
        if (booleanClockwise(coords) == reverse) {
            reverseArray(coords);
        }
    }

    private static void rewindPolygon(ArrayNode coords, boolean reverse) {
        // Outer ring
        ArrayNode outerRing = (ArrayNode) coords.get(0);
        if (booleanClockwise(outerRing) != reverse) {
            reverseArray(outerRing);
        }

        // Inner rings
        for (int i = 1; i < coords.size(); i++) {
            ArrayNode innerRing = (ArrayNode) coords.get(i);
            if (booleanClockwise(innerRing) == reverse) {
                reverseArray(innerRing);
            }
        }
    }

    private static boolean booleanClockwise(ArrayNode coords) {
        // Implementation of Shoelace Formula
        // ... 
        // (You'll need to implement this based on the Shoelace Formula)
        // ...
        return false; // Placeholder, replace with actual implementation
    }

    private static void reverseArray(ArrayNode array) {
        int i = 0;
        int j = array.size() - 1;
        while (i < j) {
            JsonNode temp = array.get(i);
            array.set(i, array.get(j));
            array.set(j, temp);
            i++;
            j--;
        }
    }
}
