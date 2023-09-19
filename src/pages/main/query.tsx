import * as React from "react";
import {
  eventtype,
  statistictype,
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
        console.log(result);
        tmp.push(result);
      }
    }
    this.seteventStatistic(tmp);
  };
}
