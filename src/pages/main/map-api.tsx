import * as React from "react";
import mapboxgl, { MapboxGeoJSONFeature, GeoJSONSource } from "mapbox-gl";
import { useCellContent } from "@/lib/core/main-content";

export class MapAPIContent {
  private map: mapboxgl.Map | undefined;
  constructor(map?: mapboxgl.Map) {
    this.map = map;
  }

  public setMap = (map: mapboxgl.Map) => {
    this.map = map;
  };

  public drawLine(Line: Map<string, number[][]>) {
    if (this.map?.getSource("Track") == undefined) {
      this.map?.addSource("Track", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      this.map?.addLayer({
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
    }
    if (Line.size > 0) {
      let Features: GeoJSON.Feature<GeoJSON.Geometry>[] = [];
      Line.forEach((value, key, map) => {
        let feat: GeoJSON.Feature<GeoJSON.Geometry> = {
          type: "Feature",
          id: key.toString(),
          properties: {
            name: key,
          },
          geometry: {
            type: "LineString",
            coordinates: value,
          },
        };
        Features.push(feat);
      });

      let map = this.map?.getSource("Track") as GeoJSONSource;

      if (map) {
        map.setData({
          type: "FeatureCollection",
          features: Features,
        });
      }
    } else {
      let map = this.map?.getSource("Track") as GeoJSONSource;
      if (map) {
        map.setData({
          type: "FeatureCollection",
          features: [],
        });
      }
    }
  }

  public drawPoint(Point: Map<string, number[]>) {
    if (this.map?.getSource("Cell") == undefined) {
      this.map?.addSource("Cell", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      this.map?.addLayer({
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
    }
    console.log(Point);
    if (Point.size > 0) {
      let Features: GeoJSON.Feature<GeoJSON.Geometry>[] = [];
      Point.forEach((value, key, map) => {
        let feat: GeoJSON.Feature<GeoJSON.Geometry> = {
          type: "Feature",
          id: key.toString(),
          properties: {
            name: key,
          },
          geometry: {
            type: "Point",
            coordinates: value,
          },
        };
        Features.push(feat);
      });
      console.log(Features);
      let map = this.map?.getSource("Cell") as GeoJSONSource;

      if (map) {
        map.setData({
          type: "FeatureCollection",
          features: Features,
        });
      }
    } else {
      let map = this.map?.getSource("Cell") as GeoJSONSource;
      if (map) {
        map.setData({
          type: "FeatureCollection",
          features: [],
        });
      }
    }
  }

  public drawArea(Polygon: Map<string, number[][]>) {
    if (this.map?.getSource("Area") == undefined) {
      this.map?.addSource("Area", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      this.map?.addLayer({
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
    }
    console.log(Polygon);
    if (Polygon.size > 0) {
      let Features: GeoJSON.Feature<GeoJSON.Geometry>[] = [];
      Polygon.forEach((value, key, map) => {
        let feat: GeoJSON.Feature<GeoJSON.Geometry> = {
          type: "Feature",
          id: key.toString(),
          properties: {
            name: key,
          },
          geometry: {
            type: "Polygon",
            coordinates: [value],
          },
        };
        Features.push(feat);
      });

      let map = this.map?.getSource("Area") as GeoJSONSource;

      if (map) {
        map.setData({
          type: "FeatureCollection",
          features: Features,
        });
      }
    } else {
      let map = this.map?.getSource("Area") as GeoJSONSource;
      if (map) {
        map.setData({
          type: "FeatureCollection",
          features: [],
        });
      }
    }
  }
}
