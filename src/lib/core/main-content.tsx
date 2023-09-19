import * as React from "react";

export interface eventtype {
  _id: string;
  time: string;
  cells: string[];
}

export interface cellObjecttype {
  Event: eventtype[];
  setEvent: React.Dispatch<React.SetStateAction<eventtype[]>>;
}

interface content {
  children?: any;
}

export const cellContext = React.createContext<cellObjecttype>({
  Event: [],
  setEvent: () => {},
});

export const useCellContent = () => React.useContext(cellContext);

export const ObjectProvider = React.memo<content>(({ children }) => {
  const [Event, setEvent] = React.useState<eventtype[]>([]);
  return (
    <cellContext.Provider
      value={{
        Event,
        setEvent,
      }}
    >
      {children}
    </cellContext.Provider>
  );
});
