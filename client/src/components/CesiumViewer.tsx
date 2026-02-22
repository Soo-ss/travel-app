import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

interface Props {
  onReady: (viewer: Cesium.Viewer) => void;
}

// 지도
export default function CesiumViewer({ onReady }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new Cesium.Viewer(containerRef.current, {
      terrain: Cesium.Terrain.fromWorldTerrain(),
      animation: false,
      timeline: false,
    });

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        126.978, // lng
        37.5665, // lat
        15000,
      ),
    });

    onReady(viewer);

    return () => {
      viewer.destroy();
    };
  }, [onReady]);

  return <div ref={containerRef} style={{ width: "100%", height: "50vh" }} />;
}
