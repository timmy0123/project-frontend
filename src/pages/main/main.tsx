import { _Map } from "./map";
import * as React from "react";
import { makeStyles } from "@material-ui/core";
import {
  Stack,
  Grid,
  Button,
  Box,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import utc from "dayjs/plugin/utc";
import { Query } from "./query";
import { useCellContent } from "@/lib/core/main-content";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { statistictype } from "../../lib/core/main-content";
import { StylesProvider } from "@material-ui/core/styles";

dayjs.extend(utc);

const useStyles = makeStyles({
  customTable: {
    position: "relative",
  },
  footer: {
    position: "fixed",
    bottom: 0,
  },
});

export const MainContent: React.FC = ({}) => {
  const q = new Query();
  const [onQuery, setonQuery] = React.useState<boolean>(false);
  const [onTable, setonTable] = React.useState<boolean>(false);
  const [selectRow, setselectRow] = React.useState<GridRowSelectionModel>([]);
  const [startDate, setstartDate] = React.useState<Dayjs | null>(
    dayjs("2019-07-25").utc()
  );
  const [startTime, setstartTime] = React.useState<Dayjs | null>(
    dayjs("2019-07-25T15:30").utc()
  );
  const [endDate, setendDate] = React.useState<Dayjs | null>(
    dayjs("2019-07-25").utc()
  );
  const [endTime, setendTime] = React.useState<Dayjs | null>(
    dayjs("2019-07-25T15:30").utc()
  );
  const [Region, setRegion] = React.useState("UK");
  const [timeSteps, settimeSteps] = React.useState<Map<string, number>>(
    new Map()
  );
  const [timeStepsRev, settimeStepsRev] = React.useState<Map<number, string>>(
    new Map()
  );
  const [allLine, setallLine] = React.useState<Map<string, number[][]>>(
    new Map()
  );
  const [allPoint, setallPoint] = React.useState<Map<string, number[]>>(
    new Map()
  );
  const [allPolygon, setallPolygon] = React.useState<Map<string, number[][]>>(
    new Map()
  );

  const {
    Loaded,
    Cell,
    setCell,
    Event,
    eventStatistic,
    Line,
    setLine,
    Point,
    setPoint,
    Polygon,
    setPolygon,
  } = useCellContent();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", type: "string", width: 150 },
    { field: "area", headerName: "area", type: "number", width: 100 },
    { field: "lifespan", headerName: "lifespan", type: "number", width: 100 },
    {
      field: "stormType",
      headerName: "Type",
      type: "string",
      width: 70,
    },
  ];
  function valuetext(value: number) {
    return timeStepsRev.get(value)!;
  }

  const rotatedStyle = {
    transform: "rotate(90deg)", // Rotate text by 90 degrees
  };

  const classes = useStyles();

  const generateTimeValue = (startTime: Dayjs, endTime: Dayjs) => {
    let currentTime = startTime;
    let idx = 0;
    let step: Map<string, number> = new Map();
    let stepRev: Map<number, string> = new Map();
    while (currentTime < endTime) {
      const fromattedTime: string = currentTime
        .toISOString()
        .slice(0, 16)
        .replace(/[-T:]/g, "");
      step.set(fromattedTime, idx);
      stepRev.set(idx, fromattedTime);
      idx++;
      currentTime = currentTime.add(5, "minute");
    }
    for (let i = 0; i < 20; i++) {
      const fromattedTime: string = currentTime
        .toISOString()
        .slice(0, 16)
        .replace(/[-T:]/g, "");
      step.set(fromattedTime, idx);
      stepRev.set(idx, fromattedTime);
      idx++;
      currentTime = currentTime.add(5, "minute");
    }
    settimeSteps(step);
    settimeStepsRev(stepRev);
  };

  React.useEffect(() => {
    q.queryEventStatistic(Region);
  }, [Event]);

  return (
    <StylesProvider injectFirst>
      <Stack>
        <_Map />
        <Stack
          width="95wh"
          height="95vh"
          spacing={3}
          marginTop={1}
          marginLeft={1}
          marginRight={1}
        >
          {Loaded ? (
            <Grid container>
              <Grid item xs={5}>
                <Box
                  width="13vw"
                  height="10vh"
                  className={classes.customTable}
                  sx={{
                    backgroundColor: "white",
                    boxShadow: 10,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Grid container>
                    <Grid item xs={0.5} />
                    <Grid
                      item
                      xs={4.5}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          setonQuery(!onQuery);
                          setonTable(false);
                        }}
                      >
                        Query
                      </Button>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={5.5}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          setonTable(!onTable);
                          setonQuery(false);
                        }}
                      >
                        Property
                      </Button>
                    </Grid>
                    <Grid item xs={0.5} />
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={5} />
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Box
                  className={classes.customTable}
                  width="8vw"
                  height="10vh"
                  sx={{
                    backgroundColor: "white",
                    boxShadow: 10,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <a>aaa</a>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}

          {onQuery || (onTable && eventStatistic) ? (
            onQuery ? (
              <Box
                className={classes.customTable}
                width="30vw"
                height="auto"
                sx={{
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: 3,
                }}
              >
                <Stack width="95%" spacing={1.3} marginTop={1} marginBottom={1}>
                  <Grid width="100%" container>
                    <Grid
                      item
                      width="100%"
                      xs={9.5}
                      marginLeft={1}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography variant="body1">Query</Typography>
                    </Grid>
                    <Grid
                      item
                      width="100%"
                      xs={2}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Box
                        width="100%"
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <IconButton onClick={() => setonQuery(false)}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container width="100%">
                    <Grid
                      item
                      width="100%"
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">Region</Typography>
                    </Grid>
                    <Grid item width="100%" xs={8}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={Region}
                        fullWidth
                        label="Region"
                        onChange={(event: SelectChangeEvent) => {
                          setRegion(event.target.value as string);
                        }}
                      >
                        <MenuItem value={"UK"}>UK</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container width="100%">
                      <Grid item xs={5.9}>
                        <DatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={(newValue) => setstartDate(newValue)}
                        />
                      </Grid>
                      <Grid item xs={0.2} />
                      <Grid item xs={5.9}>
                        <TimePicker
                          label="Start Time"
                          value={startTime}
                          onChange={(newValue) => setstartTime(newValue)}
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container width="100%">
                      <Grid item xs={5.9}>
                        <DatePicker
                          label="End Date"
                          value={endDate}
                          onChange={(newValue) => setendDate(newValue)}
                        />
                      </Grid>
                      <Grid item xs={0.2} />
                      <Grid item xs={5.9}>
                        <TimePicker
                          label="End Time"
                          value={endTime}
                          onChange={(newValue) => setendTime(newValue)}
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                  <Box
                    width="100%"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction={"row"} spacing={1}>
                      <Button
                        variant="outlined"
                        onClick={() => setonQuery(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          const combinedStartDateTime =
                            startDate && startTime
                              ? startDate
                                  .set("hour", startTime.hour())
                                  .set("minute", startTime.minute())
                              : null;

                          const combinedEndDateTime =
                            endDate && endTime!
                              ? endDate
                                  .set("hour", endTime.hour())
                                  .set("minute", endTime.minute())
                              : null;

                          q.queryEvent(
                            combinedStartDateTime!.toISOString(),
                            combinedEndDateTime!.toISOString()
                          );
                          generateTimeValue(
                            combinedStartDateTime!,
                            combinedEndDateTime!
                          );
                          setonQuery(false);
                          setonTable(true);
                        }}
                      >
                        Query
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Box
                className={classes.customTable}
                width="30vw"
                height="auto"
                sx={{
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: 3,
                }}
              >
                <Stack width="100%" marginRight={1}>
                  <Grid width="100%" container>
                    <Grid
                      item
                      width="100%"
                      xs={9.5}
                      marginLeft={1}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography variant="body1">Event Properties</Typography>
                    </Grid>
                    <Grid
                      item
                      width="100%"
                      xs={2}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Box
                        width="100%"
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <IconButton onClick={() => setonTable(false)}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box width="100%">
                    <DataGrid
                      rows={eventStatistic}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5, 8]}
                      checkboxSelection
                      rowSelectionModel={selectRow}
                      onRowSelectionModelChange={async (newSelection) => {
                        setselectRow(newSelection);
                        let _point: Map<string, number[]> = new Map();
                        let _polygon: Map<string, number[][]> = new Map();
                        let _line: Map<string, number[][]> = new Map();
                        let n = newSelection.length;
                        if (n == 0) {
                          setLine(_line);
                          setallLine(_line);
                          setPoint(_point);
                          setallPoint(_point);
                          setPolygon(_polygon);
                          setallPolygon(_polygon);
                        } else {
                          for (let i = 0; i < n; i++) {
                            let lifespans = await q.queryTrack(
                              newSelection[i] as string
                            );
                            if (lifespans) {
                              let m = lifespans.length;
                              for (let j = 0; j < m; j++) {
                                let l = lifespans[j].length;
                                let singleLine: number[][] = [];
                                for (let k = 0; k < l; k++) {
                                  let coord: number[] = [];
                                  let area: number[][] = [];
                                  if (Cell.has(lifespans[j][k])) {
                                    coord = [
                                      Cell.get(lifespans[j][k])!.elHist.ctrd1,
                                      Cell.get(lifespans[j][k])!.elHist.ctrd0,
                                    ];
                                    area = Cell.get(
                                      lifespans[j][k]
                                    )!.cellPolygon;
                                  } else {
                                    let res = await q.queryProp(
                                      lifespans[j][k] as string,
                                      Region
                                    );
                                    if (res) {
                                      Cell.set(lifespans[j][k], res);
                                      setCell(Cell);
                                      coord = [
                                        res!.elHist.ctrd1,
                                        res!.elHist.ctrd0,
                                      ];
                                      area = res!.cellPolygon;
                                    }
                                  }
                                  if (coord.length > 1) {
                                    singleLine.push(coord);
                                    _point.set(lifespans[j][k], coord);
                                  }
                                  if (area.length > 1) {
                                    _polygon.set(lifespans[j][k], area);
                                    console.log(_polygon);
                                    console.log(_point);
                                  }
                                }
                                _line.set(
                                  lifespans[j][0] + "_" + lifespans[j][l - 1],
                                  singleLine
                                );
                              }
                            }
                          }
                          setPoint(_point);
                          setallPoint(_point);
                          setLine(_line);
                          setallLine(_line);
                          setPolygon(_polygon);
                          setallPolygon(_polygon);
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
            )
          ) : (
            <Box />
          )}
        </Stack>
        <Box
          width="100vw"
          height={30}
          display={allLine.size > 0 ? "block" : "none"}
          sx={{
            backgroundColor: "#e1e1e1",
          }}
          className={classes.footer}
        >
          <Slider
            aria-label="Small steps"
            defaultValue={timeSteps.size > 0 ? timeSteps.size - 1 : 10}
            getAriaValueText={valuetext}
            step={1}
            marks
            min={0}
            max={timeSteps.size > 0 ? timeSteps.size - 1 : 10}
            valueLabelDisplay="auto"
            onChange={(e) => {
              let curLine: Map<string, number[][]> = new Map();
              allLine.forEach((value, key, map) => {
                let startidx: number = timeSteps.get(key.split("_")[0])!;
                let arr: number[][] = [];
                value.forEach((v) => {
                  if (startidx <= e.target!.value) {
                    arr.push(v);
                  }
                  startidx++;
                });
                curLine.set(key, arr);
              });
              setLine(curLine);

              let curPoint: Map<string, number[]> = new Map();
              allPoint.forEach((value, key, map) => {
                let timeidx: number = timeSteps.get(key.split("_")[0])!;
                if (timeidx <= e.target!.value) {
                  curPoint.set(key, value);
                }
              });
              setPoint(curPoint);

              let curPolygon: Map<string, number[][]> = new Map();
              allPolygon.forEach((value, key, map) => {
                let timeidx: number = timeSteps.get(key.split("_")[0])!;
                if (timeidx <= e.target!.value) {
                  curPolygon.set(key, value);
                }
              });
              setPolygon(curPolygon);
            }}
          />
        </Box>
      </Stack>
    </StylesProvider>
  );
};
