import * as React from "react";
import * as _ from "lodash";

export interface eventtype {
  _id: string;
  time: string;
  cells: string[];
}

export interface statistictype {
  id: string;
  _id: string;
  area: number;
  lifespan: number;
  stormType: string;
  XLeft: number;
  XRight: number;
  YTop: number;
  YBottom: number;
}

export interface tracktype {
  _id: string;
  path: string[][];
}

export interface properityType {
  _id: string;
  time: Date;
  fid: {
    lab: number;
    lev: number;
  };
  pts: number[][];
  ellipse: number[][];
  cellPolygon: number[][];
  elHist: {
    smjr: number;
    smnr: number;
    ar: number;
    ctrd0: number;
    ctrd1: number;
    ang: number;
    ofvec: number[];
    stdctrd: number;
    stdctrd0: number;
    stdctrd1: number;
  };
  maxVal: number;
  sumVals: number;
  weightedctrd0: number;
  weightedctrd1: number;
  ofvec: number[];
  stdctrd: number;
  stdctrd0: number;
  stdctrd1: number;
  ttype: string;
}

export interface cellObjecttype {
  Loaded: boolean;
  setLoaded: React.Dispatch<boolean>;
  Cell: Map<string, properityType>;
  setCell: React.Dispatch<Map<string, properityType>>;
  Event: eventtype[];
  setEvent: React.Dispatch<React.SetStateAction<eventtype[]>>;
  eventStatistic: statistictype[];
  seteventStatistic: React.Dispatch<React.SetStateAction<statistictype[]>>;
  Line: Map<string, number[][]>;
  setLine: React.Dispatch<React.SetStateAction<Map<string, number[][]>>>;
  Point: Map<string, number[]>;
  setPoint: React.Dispatch<React.SetStateAction<Map<string, number[]>>>;
  Polygon: Map<string, number[][]>;
  setPolygon: React.Dispatch<React.SetStateAction<Map<string, number[][]>>>;
}

interface content {
  children?: any;
}

export const cellContext = React.createContext<cellObjecttype>({
  Loaded: false,
  setLoaded: _.noop,
  Cell: new Map(),
  setCell: _.noop,
  Event: [],
  setEvent: _.noop,
  eventStatistic: [],
  seteventStatistic: _.noop,
  Line: new Map(),
  setLine: _.noop,
  Point: new Map(),
  setPoint: _.noop,
  Polygon: new Map(),
  setPolygon: _.noop,
});

export const useCellContent = () => React.useContext(cellContext);

export const ObjectProvider = React.memo<content>(({ children }) => {
  const [Cell, setCell] = React.useState<Map<string, properityType>>(new Map());
  const [Event, setEvent] = React.useState<eventtype[]>([]);
  const [eventStatistic, seteventStatistic] = React.useState<statistictype[]>(
    []
  );
  const [Line, setLine] = React.useState<Map<string, number[][]>>(new Map());
  const [Point, setPoint] = React.useState<Map<string, number[]>>(new Map());
  const [Polygon, setPolygon] = React.useState<Map<string, number[][]>>(
    new Map()
  );
  const [Loaded, setLoaded] = React.useState<boolean>(false);
  return (
    <cellContext.Provider
      value={{
        Loaded,
        setLoaded,
        Cell,
        setCell,
        Event,
        setEvent,
        eventStatistic,
        seteventStatistic,
        Line,
        setLine,
        Point,
        setPoint,
        Polygon,
        setPolygon,
      }}
    >
      {children}
    </cellContext.Provider>
  );
});
