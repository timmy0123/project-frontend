import * as React from "react";
import {
  eventtype,
  statistictype,
  tracktype,
  properityType,
  useCellContent,
} from "@/lib/core/main-content";

export class Query {
  constructor() {}

  public queryEvent = async (startTime: string, endTime: string) => {
    const response = await fetch(
      `http://localhost:5566/getEvents?startdate=${startTime}&enddate=${endTime}`
    );
    const result = await response.json();
    return result;
  };

  public queryEventStatistic = async (Event: eventtype[], ProjName: string) => {
    let tmp: statistictype[] = [];
    let n = Event.length;
    for (let i = 0; i < n; i++) {
      let m = Event[i].cells.length;
      for (let j = 0; j < m; j++) {
        let InitCell = Event[i].cells[j];
        const response = await fetch(
          `http://localhost:5566/getStatistic?id=${InitCell}&ProjName=${ProjName}`
        );
        const result: statistictype = await response.json();
        result.id = result._id;
        tmp.push(result);
      }
    }
    return tmp;
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
  ): Promise<properityType | undefined> => {
    const response = await fetch(
      `http://localhost:5566/getCellProp?id=${id}&ProjName=${ProjName}`
    );
    const result: properityType = await response.json();
    if (result) return result;
    else return undefined;
  };
}
