import * as React from "react";
import mapboxgl, { MapboxGeoJSONFeature, GeoJSONSource } from "mapbox-gl";

export class MapAPIContent {
  private map: mapboxgl.Map | undefined;
  constructor(map?: mapboxgl.Map) {
    this.map = map;
  }
  public setMap = (map: mapboxgl.Map) => {
    this.map = map;
  };
}
