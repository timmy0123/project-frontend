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

  public drawLine(Line: number[][][]) {
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
    if (Line.length > 0) {
      let idx = 0;
      let Features: GeoJSON.Feature<GeoJSON.Geometry>[] = [];
      for (let idx = 0; idx < Line.length; idx++) {
        let feat: GeoJSON.Feature<GeoJSON.Geometry> = {
          type: "Feature",
          id: idx.toString(),
          properties: {
            name: idx,
          },
          geometry: {
            type: "LineString",
            coordinates: Line[idx],
          },
        };
        Features.push(feat);
      }
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

  public drawPoint(Point: number[][]) {
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
    if (Point.length > 0) {
      let idx = 0;
      let Features: GeoJSON.Feature<GeoJSON.Geometry>[] = [];
      console.log(Point.length);
      for (let idx = 0; idx < Point.length; idx++) {
        let feat: GeoJSON.Feature<GeoJSON.Geometry> = {
          type: "Feature",
          id: idx.toString(),
          properties: {
            name: idx,
          },
          geometry: {
            type: "Point",
            coordinates: Point[idx],
          },
        };
        Features.push(feat);
      }
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
}
