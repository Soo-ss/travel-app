import * as Cesium from "cesium";
import type { LatLng } from "../types/travel";

export function drawRoute(viewer: Cesium.Viewer, points: LatLng[]) {
  viewer.entities.removeAll();

  viewer.entities.add({
    polyline: {
      positions: points.map((p) => Cesium.Cartesian3.fromDegrees(p.lng, p.lat)),
      width: 4,
      material: Cesium.Color.CYAN,
    },
  });

  viewer.zoomTo(viewer.entities);
}
