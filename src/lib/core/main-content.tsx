import * as React from "react";

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
  Event: eventtype[];
  setEvent: React.Dispatch<React.SetStateAction<eventtype[]>>;
  eventStatistic: statistictype[];
  seteventStatistic: React.Dispatch<React.SetStateAction<statistictype[]>>;
  Line: number[][][];
  setLine: React.Dispatch<React.SetStateAction<number[][][]>>;
  Point: number[][];
  setPoint: React.Dispatch<React.SetStateAction<number[][]>>;
}

interface content {
  children?: any;
}

export const cellContext = React.createContext<cellObjecttype>({
  Event: [],
  setEvent: () => {},
  eventStatistic: [],
  seteventStatistic: () => {},
  Line: [],
  setLine: () => {},
  Point: [],
  setPoint: () => {},
});

export const useCellContent = () => React.useContext(cellContext);

export const ObjectProvider = React.memo<content>(({ children }) => {
  const [Event, setEvent] = React.useState<eventtype[]>([]);
  const [eventStatistic, seteventStatistic] = React.useState<statistictype[]>(
    []
  );
  const [Line, setLine] = React.useState<number[][][]>([]);
  const [Point, setPoint] = React.useState<number[][]>([]);
  return (
    <cellContext.Provider
      value={{
        Event,
        setEvent,
        eventStatistic,
        seteventStatistic,
        Line,
        setLine,
        Point,
        setPoint,
      }}
    >
      {children}
    </cellContext.Provider>
  );
});
