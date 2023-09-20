import * as React from "react";
import {
  eventtype,
  statistictype,
  tracktype,
  properityType,
  useCellContent,
} from "@/lib/core/main-content";

export class Query {
  private Event: eventtype[];
  private setEvent: React.Dispatch<React.SetStateAction<eventtype[]>>;
  private eventStatistic: statistictype[];
  private seteventStatistic: React.Dispatch<
    React.SetStateAction<statistictype[]>
  >;
  constructor() {
    const { Event, setEvent, eventStatistic, seteventStatistic } =
      useCellContent();
    this.Event = Event;
    this.setEvent = setEvent;
    this.eventStatistic = eventStatistic;
    this.seteventStatistic = seteventStatistic;
  }

  public queryEvent = async (startTime: string, endTime: string) => {
    const response = await fetch(
      `http://localhost:5566/getEvents?startdate=${startTime}&enddate=${endTime}`
    );
    const result = await response.json();
    this.setEvent(result);
  };

  public queryEventStatistic = async (ProjName: string) => {
    let tmp: statistictype[] = [];
    let n = this.Event.length;
    for (let i = 0; i < n; i++) {
      let m = this.Event[i].cells.length;
      for (let j = 0; j < m; j++) {
        let InitCell = this.Event[i].cells[j];
        const response = await fetch(
          `http://localhost:5566/getStatistic?id=${InitCell}&ProjName=${ProjName}`
        );
        const result: statistictype = await response.json();
        result.id = result._id;
        tmp.push(result);
      }
    }
    this.seteventStatistic(tmp);
  };

  public queryTrack = async (id: string): Promise<string[][] | undefined> => {
    const response = await fetch(`http://localhost:5566/getTrack?id=${id}`);
    const result: tracktype = await response.json();
    if (result) return result.path;
    else return undefined;
  };

  public queryProp = async (
    id: string,
    ProjName: string
  ): Promise<number[] | undefined> => {
    const response = await fetch(
      `http://localhost:5566/getCellProp?id=${id}&ProjName=${ProjName}`
    );
    const result: properityType = await response.json();
    if (result) return [result.elHist.ctrd1, result.elHist.ctrd0];
    else return undefined;
  };
}
