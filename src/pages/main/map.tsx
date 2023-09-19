import mapboxgl from "mapbox-gl";
import { MapAPIContent } from "./map-api";
import * as React from "react";
import { styled } from "../../styles";
import { eventtype, useCellContent } from "@/lib/core/main-content";

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
    bottom: theme.spacing(0.5),
    left: theme.spacing(0.5),
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
  const { eventStatistic } = useCellContent();

  React.useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current ?? "body",
        style: "mapbox://styles/mapbox/light-v10",
        center: [lng, lat],
        zoom,
      });
      mapApi.current.setMap(map.current);
    }

    map.current.setCenter([lng, lat]);
    map.current.setZoom(zoom);
  }, [onLoaded]);
  return (
    <>
      <StyledMap ref={mapContainer} />
      {children}
    </>
  );
});
