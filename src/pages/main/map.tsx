import mapboxgl from "mapbox-gl";
import { MapAPIContent } from "../../lib/mapApi/map-api";
import * as React from "react";
import { styled } from "../../styles";
import { eventtype, useCellContent } from "@/lib/core/main-content";
import exp from "constants";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;
export interface IMap {
  onLoaded?: (api: MapAPIContent) => void;
  children?: any;
}

const StyledMap = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "absolute",
  "& .mapboxgl-ctrl-attrib-button": {
    position: "fixed",
    bottom: theme.spacing(1),
    left: theme.spacing(1),
  },
  "& .mapboxgl-control-container": {
    display: "none",
  },
  "& .mapboxgl-popup-content": {
    width: "420px",
    height: "300px",
  },
}));

export const _Map = React.memo<IMap>(({ onLoaded, children }) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map>();
  const [zoom, setZoom] = React.useState(5);
  const { lng, lat } = { lng: -2, lat: 55 };
  const mapApi = React.useRef(new MapAPIContent(map.current));
  const {
    eventStatistic,
    Line,
    Point,
    Polygon,
    Ellipse,
    setLoaded,
    displayEllipse,
    displayPolygon,
  } = useCellContent();

  React.useEffect(() => {
    mapApi.current.drawLine(Line);
    mapApi.current.drawPoint(Point);
    mapApi.current.drawArea(Polygon);
    mapApi.current.drawEllipse(Ellipse);
  }, [Line]);
  React.useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current ?? "body",
        style: "mapbox://styles/mapbox/light-v10",
        center: [lng, lat],
        zoom,
      });

      map.current.on("load", () => {
        map.current!.addSource("Track", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.current!.addLayer({
          id: "Track",
          type: "line",
          source: "Track",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "blue",
              "#888",
            ],
            "line-width": 2,
          },
        });

        map.current!.addSource("Cell", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.current!.addLayer({
          id: "Cell",
          type: "circle",
          source: "Cell",
          paint: {
            "circle-radius": 5,
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "blue",
              "white",
            ],
            "circle-stroke-color": "black",
            "circle-stroke-width": 2,
          },
          filter: ["in", "$type", "Point"],
        });

        map.current!.addSource("Area", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.current!.addLayer({
          id: "Area",
          type: "fill",
          source: "Area",
          layout: {},
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "blue",
              "#0080ff",
            ], // blue color fill
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.5,
            ],
            "fill-outline-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "blue",
              "#0080ff",
            ],
          },
        });

        map.current!.addSource("Ellipse", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.current!.addLayer({
          id: "Ellipse",
          type: "fill",
          source: "Ellipse",
          layout: {},
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "blue",
              "red",
            ], // blue color fill
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.5,
            ],
            "fill-outline-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "blue",
              "red",
            ],
          },
        });
      });

      mapApi.current.setMap(map.current);
    }

    map.current.setCenter([lng, lat]);
    map.current.setZoom(zoom);
    setLoaded(true);
  }, [onLoaded]);

  React.useEffect(() => {
    map.current?.on("idle", () => {
      if (!displayEllipse)
        map.current?.setLayoutProperty("Ellipse", "visibility", "none");
      else map.current?.setLayoutProperty("Ellipse", "visibility", "visible");
    });
  }, [displayEllipse]);

  React.useEffect(() => {
    map.current?.on("idle", () => {
      if (!displayPolygon)
        map.current?.setLayoutProperty("Area", "visibility", "none");
      else map.current?.setLayoutProperty("Area", "visibility", "visible");
    });
  }, [displayPolygon]);
  return (
    <>
      <StyledMap ref={mapContainer} />
      {children}
    </>
  );
});

_Map.displayName = "_Map";

export default _Map;
