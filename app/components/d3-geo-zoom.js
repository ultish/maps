import { select as d3Select, pointers as d3Pointers } from 'd3';
import { zoom as d3Zoom } from 'd3';
import versor from 'versor';

// Function to create and configure the zoom behavior
export default function createZoomBehavior(nodeEl, options = {}) {
  // Destructure options with defaults
  const {
    projection,
    scaleExtent = [0.1, 1e3],
    northUp = false,
    noRotation = false,
    onMove = () => {},
  } = options;

  // State variables to track zoom behavior
  let unityScale = projection ? projection.scale() : 1;
  let v0, r0, q0;

  // Zoom event handlers
  function zoomStarted(ev) {
    if (!projection) return;

    v0 = versor.cartesian(projection.invert(getPointerCoords(ev)));
    r0 = projection.rotate();
    q0 = versor(r0);
  }

  function zoomed(ev) {
    if (!projection) return;

    const scale = ev.transform.k * unityScale;
    projection.scale(scale);

    const v1 = versor.cartesian(
        projection.rotate(r0).invert(getPointerCoords(ev)),
      ),
      q1 = versor.multiply(q0, versor.delta(v0, v1)),
      rotation = versor.rotation(q1);

    if (!noRotation) {
      if (northUp) {
        rotation[2] = 0; // Don't rotate on Z axis
      }
      projection.rotate(rotation);
    }

    onMove({ scale, rotation });
  }

  // Helper function to get pointer coordinates
  function getPointerCoords(zoomEv) {
    const avg = (vals) => vals.reduce((agg, v) => agg + v, 0) / vals.length;

    const pointers = d3Pointers(zoomEv, nodeEl);
    return pointers && pointers.length > 1
      ? [0, 1].map((idx) => avg(pointers.map((t) => t[idx]))) // calc centroid of all points if multi-touch
      : pointers.length
        ? pointers[0] // single point click
        : [undefined, undefined];
  }

  // Create and configure the zoom behavior
  const zoom = d3Zoom()
    .scaleExtent(scaleExtent)
    .on('start', zoomStarted)
    .on('zoom', zoomed);

  // Apply the zoom behavior to the selection
  d3Select(nodeEl).call(zoom);

  // Return an object to manage the zoom behavior
  return {
    // Update options
    updateOptions(newOptions) {
      Object.assign(options, newOptions);
      if (newOptions.scaleExtent) {
        zoom.scaleExtent(newOptions.scaleExtent);
      }
      if (newOptions.projection) {
        unityScale = newOptions.projection.scale();
      }
    },
    // // Destroy the zoom behavior
    // destroy() {
    //   d3Select(nodeEl).on('.zoom', null);
    // },
  };
}
