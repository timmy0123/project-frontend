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

export interface cellObjecttype {
  Event: eventtype[];
  setEvent: React.Dispatch<React.SetStateAction<eventtype[]>>;
  eventStatistic: statistictype[];
  seteventStatistic: React.Dispatch<React.SetStateAction<statistictype[]>>;
}

interface content {
  children?: any;
}

export const cellContext = React.createContext<cellObjecttype>({
  Event: [],
  setEvent: () => {},
  eventStatistic: [],
  seteventStatistic: () => {},
});

export const useCellContent = () => React.useContext(cellContext);

export const ObjectProvider = React.memo<content>(({ children }) => {
  const [Event, setEvent] = React.useState<eventtype[]>([]);
  const [eventStatistic, seteventStatistic] = React.useState<statistictype[]>(
    []
  );
  return (
    <cellContext.Provider
      value={{
        Event,
        setEvent,
        eventStatistic,
        seteventStatistic,
      }}
    >
      {children}
    </cellContext.Provider>
  );
});
