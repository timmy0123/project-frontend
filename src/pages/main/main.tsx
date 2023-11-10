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
  Checkbox,
  FormControlLabel,
  Divider,
  Tooltip,
  FormGroup,
  Modal,
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
import { Query } from "../../lib/query/query";
import { eventtype, useCellContent } from "@/lib/core/main-content";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { statistictype, properityType } from "../../lib/core/main-content";
import { StylesProvider } from "@material-ui/core/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import SearchIcon from "@mui/icons-material/Search";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LayersIcon from "@mui/icons-material/Layers";
import InfoIcon from "@mui/icons-material/Info";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import JSZip from "jszip";

dayjs.extend(utc);

const useStyles = makeStyles({
  customTable: {
    position: "relative",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    right: 0,
  },
});

interface fileType {
  name: string;
  content: string;
}

//port:18888
//port:18889
const downloadZip = async (files: fileType[]) => {
  const zip = new JSZip();

  // Add files to the zip
  files.forEach((file) => {
    zip.file(file.name, file.content);
  });

  // Generate the zip file asynchronously
  const zipBlob = await zip.generateAsync({ type: "blob" });

  // Create a download link and trigger the download
  const downloadLink = window.URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = downloadLink;
  link.download = "files.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const MainContent: React.FC = ({}) => {
  const q = new Query();
  const [onQuery, setonQuery] = React.useState<boolean>(true);
  const [onTable, setonTable] = React.useState<boolean>(false);
  const [onLayer, setonLayer] = React.useState<boolean>(false);
  const [onDownload, setonDownload] = React.useState<boolean>(false);
  const [openAboutFile, setopenAboutFile] = React.useState<boolean>(false);
  const [selectRow, setselectRow] = React.useState<GridRowSelectionModel>([]);
  const [selectEvent, setselectEvent] = React.useState<Map<string, string[][]>>(
    new Map()
  );
  const [selectCell, setselectCell] = React.useState<
    Map<String, properityType>
  >(new Map());
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
  const [curTime, setcurTime] = React.useState<number | undefined>(undefined);
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

  const [allEllipse, setallEllipse] = React.useState<Map<string, number[][]>>(
    new Map()
  );

  const [showTool, setshowTool] = React.useState<boolean>(true);

  const {
    Loaded,
    Cell,
    setCell,
    Event,
    setEvent,
    eventStatistic,
    Line,
    setLine,
    Point,
    setPoint,
    Polygon,
    setPolygon,
    Ellipse,
    setEllipse,
    displayEllipse,
    setdisplayEllipse,
    displayPolygon,
    setdisplayPolygon,
    seteventStatistic,
  } = useCellContent();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", type: "string", width: 12 },
    //{ field: "area", headerName: "area", type: "number", width: 70 },
    { field: "lifespan", headerName: "lifespan", type: "number", width: 120 },
    {
      field: "stormType",
      headerName: "Type",
      type: "string",
      width: 90,
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
    (async () => {
      let res = await q.queryEventStatistic(Event, Region);
      seteventStatistic(res);
    })();
  }, [Event]);

  return (
    <StylesProvider injectFirst>
      <Stack>
        <_Map />
        {Loaded ? (
          <Box
            width={showTool ? "25vw" : "2.5vw"}
            height="100vh"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
            className={classes.customTable}
          >
            <Stack direction={"row"} width="100%" height="100%">
              <Box width="2.5vw" height="100%">
                <Stack spacing={1} marginLeft={0.5} marginTop={1}>
                  <IconButton
                    onClick={() => {
                      setshowTool(!showTool);
                      setonQuery(false);
                      setonTable(false);
                      setonLayer(false);
                    }}
                  >
                    {showTool ? (
                      <KeyboardArrowLeftIcon />
                    ) : (
                      <KeyboardArrowRightIcon />
                    )}
                  </IconButton>
                  <Tooltip
                    title="Query"
                    placement="right"
                    //disableHoverListener={fullleIcon}
                    arrow
                  >
                    <IconButton
                      sx={{
                        backgroundColor: onQuery ? "#C0C0C0" : "none",
                      }}
                      onClick={() => {
                        setshowTool(true);
                        setonQuery(true);
                        setonTable(false);
                        setonLayer(false);
                        setonDownload(false);
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Cell Properity"
                    placement="right"
                    //disableHoverListener={fullleIcon}
                    arrow
                  >
                    <IconButton
                      sx={{
                        backgroundColor: onTable ? "#C0C0C0" : "none",
                      }}
                      onClick={() => {
                        setshowTool(true);
                        setonQuery(false);
                        setonTable(true);
                        setonLayer(false);
                        setonDownload(false);
                      }}
                    >
                      <ListAltIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Layer"
                    placement="right"
                    //disableHoverListener={fullleIcon}
                    arrow
                  >
                    <IconButton
                      sx={{
                        backgroundColor: onLayer ? "#C0C0C0" : "none",
                      }}
                      onClick={() => {
                        setshowTool(true);
                        setonQuery(false);
                        setonTable(false);
                        setonLayer(true);
                        setonDownload(false);
                      }}
                    >
                      <LayersIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download" placement="right" arrow>
                    <IconButton
                      sx={{
                        backgroundColor: onDownload ? "#C0C0C0" : "none",
                      }}
                      onClick={() => {
                        setshowTool(true);
                        setonQuery(false);
                        setonTable(false);
                        setonLayer(false);
                        setonDownload(true);
                      }}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <Divider orientation="vertical" />
              <Box
                width="22.5vw"
                height="100%"
                display={showTool ? "block" : "none"}
              >
                {onQuery ? (
                  <Stack width="95%" spacing={2} marginTop={1} marginLeft={1}>
                    <Typography variant="h6">Query</Typography>
                    <Divider />
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
                        <Typography variant="body1">Region</Typography>
                      </Grid>
                      <Grid item width="100%" xs={8}>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          size="small"
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
                    <Divider />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container width="100%" spacing={1.5}>
                        <Grid item xs={12}>
                          <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setstartDate(newValue)}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TimePicker
                            label="Start Time"
                            value={startTime}
                            onChange={(newValue) => setstartTime(newValue)}
                          />
                        </Grid>
                      </Grid>
                    </LocalizationProvider>
                    <Divider />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container width="100%" spacing={1.5}>
                        <Grid item xs={12}>
                          <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setendDate(newValue)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TimePicker
                            label="End Time"
                            value={endTime}
                            onChange={(newValue) => setendTime(newValue)}
                          />
                        </Grid>
                      </Grid>
                    </LocalizationProvider>
                    <Divider />
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
                          onClick={() => {
                            (async () => {
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
                              const res = await q.queryEvent(
                                combinedStartDateTime!.toISOString(),
                                combinedEndDateTime!.toISOString()
                              );
                              setEvent(res);
                              generateTimeValue(
                                combinedStartDateTime!,
                                combinedEndDateTime!
                              );
                              setonQuery(false);
                              setonTable(true);
                            })();
                          }}
                        >
                          Query
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                ) : onTable ? (
                  <Stack width="95%" spacing={2} marginTop={1} marginLeft={1}>
                    <Typography variant="h6">Event Properties</Typography>
                    <Divider />
                    <Box width="100%">
                      <DataGrid
                        rows={eventStatistic}
                        columns={columns}
                        disableColumnMenu
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                          },
                        }}
                        //pageSizeOptions={[5, 8]}
                        checkboxSelection
                        rowSelectionModel={selectRow}
                        onRowSelectionModelChange={async (newSelection) => {
                          setselectRow(newSelection);
                          let _point: Map<string, number[]> = new Map();
                          let _polygon: Map<string, number[][]> = new Map();
                          let _ellipse: Map<string, number[][]> = new Map();
                          let _line: Map<string, number[][]> = new Map();
                          let _selectCell: Map<string, properityType> =
                            new Map();
                          let _selectTrack: Map<string, string[][]> = new Map();
                          let n = newSelection.length;
                          if (n == 0) {
                            setLine(_line);
                            setallLine(_line);
                            setPoint(_point);
                            setallPoint(_point);
                            setPolygon(_polygon);
                            setallPolygon(_polygon);
                            setEllipse(_ellipse);
                            setallEllipse(_ellipse);
                          } else {
                            for (let i = 0; i < n; i++) {
                              let lifespans = await q.queryTrack(
                                newSelection[i] as string
                              );
                              if (lifespans) {
                                _selectTrack.set(
                                  newSelection[i] as string,
                                  lifespans
                                );
                                let m = lifespans.length;
                                for (let j = 0; j < m; j++) {
                                  let l = lifespans[j].length;
                                  let singleLine: number[][] = [];
                                  for (let k = 0; k < l; k++) {
                                    let coord: number[] = [];
                                    let area: number[][] = [];
                                    let fitEllipse: number[][] = [];
                                    if (Cell.has(lifespans[j][k])) {
                                      coord = [
                                        Cell.get(lifespans[j][k])!.elHist.ctrd1,
                                        Cell.get(lifespans[j][k])!.elHist.ctrd0,
                                      ];
                                      area = Cell.get(
                                        lifespans[j][k]
                                      )!.cellPolygon;
                                      fitEllipse = Cell.get(
                                        lifespans[j][k]
                                      )!.ellipse;
                                      _selectCell.set(
                                        lifespans[j][k],
                                        Cell.get(lifespans[j][k])!
                                      );
                                    } else {
                                      let res = await q.queryProp(
                                        lifespans[j][k] as string,
                                        Region
                                      );
                                      if (res) {
                                        Cell.set(lifespans[j][k], res);
                                        _selectCell.set(lifespans[j][k], res);
                                        setCell(Cell);
                                        coord = [
                                          res!.elHist.ctrd1,
                                          res!.elHist.ctrd0,
                                        ];
                                        area = res!.cellPolygon;
                                        fitEllipse = res!.ellipse;
                                      }
                                    }
                                    if (coord.length > 1) {
                                      singleLine.push(coord);
                                      _point.set(lifespans[j][k], coord);
                                    }
                                    if (area.length > 1) {
                                      _polygon.set(lifespans[j][k], area);
                                    }
                                    if (fitEllipse.length > 1) {
                                      _ellipse.set(lifespans[j][k], fitEllipse);
                                    }
                                  }
                                  _line.set(
                                    lifespans[j][0] + "_" + lifespans[j][l - 1],
                                    singleLine
                                  );
                                }
                              }
                            }
                            setselectCell(_selectCell);
                            setselectEvent(_selectTrack);
                            setPoint(_point);
                            setallPoint(_point);
                            setLine(_line);
                            setallLine(_line);
                            setPolygon(_polygon);
                            setallPolygon(_polygon);
                            setEllipse(_ellipse);
                            setallEllipse(_ellipse);
                          }
                        }}
                      />
                    </Box>
                  </Stack>
                ) : onLayer ? (
                  <Stack width="95%" spacing={2} marginTop={1} marginLeft={1}>
                    <Typography variant="h6">Layer</Typography>
                    <Divider />
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Ploygon"
                        onChange={() => setdisplayPolygon(!displayPolygon)}
                      />
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Ellipse"
                        onChange={() => {
                          setdisplayEllipse(!displayEllipse);
                        }}
                      />
                    </FormGroup>
                  </Stack>
                ) : (
                  <Stack width="95%" spacing={2} marginTop={1} marginLeft={1}>
                    <Typography variant="h6">Download</Typography>
                    <Divider />
                    <Grid container>
                      <Grid
                        item
                        xs={6}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1">
                          About Download Files
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <IconButton onClick={() => setopenAboutFile(true)}>
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                    <Modal
                      open={openAboutFile}
                      onClose={() => setopenAboutFile(false)}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box
                        sx={{
                          position: "absolute" as "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 800,
                          height: 500,
                          bgcolor: "background.paper",
                          border: "2px solid #000",
                          boxShadow: 24,
                          p: 4,
                        }}
                      >
                        <Grid container>
                          <Grid
                            item
                            xs={6}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            >
                              About Download Files
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <IconButton onClick={() => setopenAboutFile(false)}>
                              <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          There are two files will be download. One is the
                          tracked path of raincell, another one is rain cell's
                          property.
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <span style={{ fontWeight: "bold", color: "blue" }}>
                            The tracked path file
                          </span>{" "}
                          contains a chronological list of unique identifiers
                          representing rain cells at different time steps. For
                          example:
                        </Typography>
                        <Typography
                          id="modal-modal-description"
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          "201907240955_1_0" :
                          ["201907240955_1_0","201907241000_2_0","201907241005_1_0"]
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          "201907240955_1_0" is rain cell's id, where
                          "201907240955" indicates the time, "1" represents the
                          lab, and "0" represents the lev.
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          The initial rain cell, indicated by
                          "201907240955_1_0," serves as the key for the tracked
                          path. This key is associated with a list of subsequent
                          time steps where the rain cell has been tracked.
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <span style={{ fontWeight: "bold", color: "blue" }}>
                            The property file
                          </span>{" "}
                          contains rain cell's properties which is calculated
                          from object-based model including attributes such as
                          area, smjr, smnr, etc. Each property set is associated
                          with a unique rain cell ID, which serves as the key
                          for identification and reference.
                        </Typography>
                      </Box>
                    </Modal>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const eventJson = JSON.stringify(
                          Object.fromEntries(selectEvent)
                        );
                        const cellJson = JSON.stringify(
                          Object.fromEntries(selectCell)
                        );
                        (async () => {
                          await downloadZip([
                            { name: "track.json", content: eventJson },
                            { name: "property.json", content: cellJson },
                          ]);
                        })();
                      }}
                    >
                      Download
                    </Button>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Box>
        ) : (
          <></>
        )}
        <Box
          width={showTool ? "75vw" : "97.5vw"}
          height={30}
          display={allLine.size > 0 ? "block" : "none"}
          sx={{
            backgroundColor: "#e1e1e1",
          }}
          className={classes.footer}
        >
          <Stack direction={"row"}>
            <Box width="80%" height="100%">
              <Slider
                aria-label="Small steps"
                defaultValue={timeSteps.size > 0 ? timeSteps.size - 1 : 10}
                getAriaValueText={valuetext}
                step={1}
                marks
                min={0}
                max={timeSteps.size > 0 ? timeSteps.size - 1 : 10}
                valueLabelDisplay="auto"
                onChange={(e: any) => {
                  setcurTime(e.target.value!);
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

                  let curEllipse: Map<string, number[][]> = new Map();
                  allEllipse.forEach((value, key, map) => {
                    let timeidx: number = timeSteps.get(key.split("_")[0])!;
                    if (timeidx <= e.target!.value) {
                      curEllipse.set(key, value);
                    }
                  });
                  setEllipse(curEllipse);
                }}
              />
            </Box>
            <Box
              width="20%"
              height="100%"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <a>
                {curTime
                  ? dayjs
                      .utc(timeStepsRev.get(curTime)!, "YYYYMMDDHHmm")
                      .toString()
                  : "Null"}
              </a>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </StylesProvider>
  );
};

export default MainContent;
//<Stack
//width="95wh"
//height="95vh"
//spacing={3}
//marginTop={1}
//marginLeft={1}
//marginRight={1}
//>
//{Loaded ? (
//  <Grid container>
//    <Grid item xs={5}>
//      <Box
//        width="13vw"
//        height="10vh"
//        className={classes.customTable}
//        sx={{
//          backgroundColor: "white",
//          boxShadow: 10,
//          borderRadius: 2,
//          display: "flex",
//          alignItems: "center",
//        }}
//      >
//        <Grid container>
//          <Grid item xs={0.5} />
//          <Grid
//            item
//            xs={4.5}
//            sx={{ display: "flex", alignItems: "center" }}
//          >
//            <Button
//              fullWidth
//              variant="outlined"
//              onClick={() => {
//                setonQuery(!onQuery);
//                setonTable(false);
//              }}
//            >
//              Query
//            </Button>
//          </Grid>
//          <Grid item xs={1} />
//          <Grid item xs={5.5}>
//            <Button
//              fullWidth
//              variant="outlined"
//              onClick={() => {
//                setonTable(!onTable);
//                setonQuery(false);
//              }}
//            >
//              Property
//            </Button>
//          </Grid>
//          <Grid item xs={0.5} />
//        </Grid>
//      </Box>
//    </Grid>
//    <Grid item xs={5} />
//    <Grid
//      item
//      xs={2}
//      sx={{ display: "flex", justifyContent: "flex-end" }}
//    >
//      <Box
//        className={classes.customTable}
//        width="8vw"
//        height="10vh"
//        sx={{
//          backgroundColor: "white",
//          boxShadow: 10,
//          borderRadius: 2,
//          display: "flex",
//          alignItems: "center",
//        }}
//      >
//        <FormGroup>
//          <FormControlLabel
//            control={<Checkbox defaultChecked />}
//            label="Ploygon"
//            onChange={() => setdisplayPolygon(!displayPolygon)}
//          />
//          <FormControlLabel
//            control={<Checkbox defaultChecked />}
//            label="Ellipse"
//            onChange={() => {
//              console.log(888);
//              setdisplayEllipse(!displayEllipse);
//            }}
//          />
//        </FormGroup>
//      </Box>
//    </Grid>
//  </Grid>
//) : (
//  <></>
//)}
//
//{onQuery || (onTable && eventStatistic) ? (
//  onQuery ? (
//    <Box
//      className={classes.customTable}
//      width="30vw"
//      height="auto"
//      sx={{
//        backgroundColor: "white",
//        display: "flex",
//        justifyContent: "center",
//        borderRadius: 3,
//      }}
//    >
//      <Stack width="95%" spacing={1.3} marginTop={1} marginBottom={1}>
//        <Grid width="100%" container>
//          <Grid
//            item
//            width="100%"
//            xs={9.5}
//            marginLeft={1}
//            sx={{ display: "flex", alignItems: "center" }}
//          >
//            <Typography variant="body1">Query</Typography>
//          </Grid>
//          <Grid
//            item
//            width="100%"
//            xs={2}
//            sx={{ display: "flex", justifyContent: "flex-end" }}
//          >
//            <Box
//              width="100%"
//              sx={{ display: "flex", justifyContent: "flex-end" }}
//            >
//              <IconButton onClick={() => setonQuery(false)}>
//                <CloseIcon />
//              </IconButton>
//            </Box>
//          </Grid>
//        </Grid>
//        <Grid container width="100%">
//          <Grid
//            item
//            width="100%"
//            xs={3}
//            sx={{
//              display: "flex",
//              justifyContent: "center",
//              alignItems: "center",
//            }}
//          >
//            <Typography variant="h6">Region</Typography>
//          </Grid>
//          <Grid item width="100%" xs={8}>
//            <Select
//              labelId="demo-simple-select-label"
//              id="demo-simple-select"
//              value={Region}
//              fullWidth
//              label="Region"
//              onChange={(event: SelectChangeEvent) => {
//                setRegion(event.target.value as string);
//              }}
//            >
//              <MenuItem value={"UK"}>UK</MenuItem>
//            </Select>
//          </Grid>
//        </Grid>
//        <LocalizationProvider dateAdapter={AdapterDayjs}>
//          <Grid container width="100%">
//            <Grid item xs={5.9}>
//              <DatePicker
//                label="Start Date"
//                value={startDate}
//                onChange={(newValue) => setstartDate(newValue)}
//              />
//            </Grid>
//            <Grid item xs={0.2} />
//            <Grid item xs={5.9}>
//              <TimePicker
//                label="Start Time"
//                value={startTime}
//                onChange={(newValue) => setstartTime(newValue)}
//              />
//            </Grid>
//          </Grid>
//        </LocalizationProvider>
//        <LocalizationProvider dateAdapter={AdapterDayjs}>
//          <Grid container width="100%">
//            <Grid item xs={5.9}>
//              <DatePicker
//                label="End Date"
//                value={endDate}
//                onChange={(newValue) => setendDate(newValue)}
//              />
//            </Grid>
//            <Grid item xs={0.2} />
//            <Grid item xs={5.9}>
//              <TimePicker
//                label="End Time"
//                value={endTime}
//                onChange={(newValue) => setendTime(newValue)}
//              />
//            </Grid>
//          </Grid>
//        </LocalizationProvider>
//        <Box
//          width="100%"
//          sx={{
//            display: "flex",
//            justifyContent: "flex-end",
//            alignItems: "center",
//          }}
//        >
//          <Stack direction={"row"} spacing={1}>
//            <Button
//              variant="outlined"
//              onClick={() => setonQuery(false)}
//            >
//              Cancel
//            </Button>
//            <Button
//              variant="outlined"
//              onClick={() => {
//                const combinedStartDateTime =
//                  startDate && startTime
//                    ? startDate
//                        .set("hour", startTime.hour())
//                        .set("minute", startTime.minute())
//                    : null;
//
//                const combinedEndDateTime =
//                  endDate && endTime!
//                    ? endDate
//                        .set("hour", endTime.hour())
//                        .set("minute", endTime.minute())
//                    : null;
//
//                q.queryEvent(
//                  combinedStartDateTime!.toISOString(),
//                  combinedEndDateTime!.toISOString()
//                );
//                generateTimeValue(
//                  combinedStartDateTime!,
//                  combinedEndDateTime!
//                );
//                setonQuery(false);
//                setonTable(true);
//              }}
//            >
//              Query
//            </Button>
//          </Stack>
//        </Box>
//      </Stack>
//    </Box>
//  ) : (
//    <Box
//      className={classes.customTable}
//      width="30vw"
//      height="auto"
//      sx={{
//        backgroundColor: "white",
//        display: "flex",
//        justifyContent: "center",
//        borderRadius: 3,
//      }}
//    >
//      <Stack width="100%" marginRight={1}>
//        <Grid width="100%" container>
//          <Grid
//            item
//            width="100%"
//            xs={9.5}
//            marginLeft={1}
//            sx={{ display: "flex", alignItems: "center" }}
//          >
//            <Typography variant="body1">Event Properties</Typography>
//          </Grid>
//          <Grid
//            item
//            width="100%"
//            xs={2}
//            sx={{ display: "flex", justifyContent: "flex-end" }}
//          >
//            <Box
//              width="100%"
//              sx={{ display: "flex", justifyContent: "flex-end" }}
//            >
//              <IconButton onClick={() => setonTable(false)}>
//                <CloseIcon />
//              </IconButton>
//            </Box>
//          </Grid>
//        </Grid>
//        <Box width="100%">
//          <DataGrid
//            rows={eventStatistic}
//            columns={columns}
//            initialState={{
//              pagination: {
//                paginationModel: { page: 0, pageSize: 5 },
//              },
//            }}
//            pageSizeOptions={[5, 8]}
//            checkboxSelection
//            rowSelectionModel={selectRow}
//            onRowSelectionModelChange={async (newSelection) => {
//              setselectRow(newSelection);
//              let _point: Map<string, number[]> = new Map();
//              let _polygon: Map<string, number[][]> = new Map();
//              let _ellipse: Map<string, number[][]> = new Map();
//              let _line: Map<string, number[][]> = new Map();
//              let n = newSelection.length;
//              if (n == 0) {
//                setLine(_line);
//                setallLine(_line);
//                setPoint(_point);
//                setallPoint(_point);
//                setPolygon(_polygon);
//                setallPolygon(_polygon);
//              } else {
//                for (let i = 0; i < n; i++) {
//                  let lifespans = await q.queryTrack(
//                    newSelection[i] as string
//                  );
//                  if (lifespans) {
//                    let m = lifespans.length;
//                    for (let j = 0; j < m; j++) {
//                      let l = lifespans[j].length;
//                      let singleLine: number[][] = [];
//                      for (let k = 0; k < l; k++) {
//                        let coord: number[] = [];
//                        let area: number[][] = [];
//                        let fitEllipse: number[][] = [];
//                        if (Cell.has(lifespans[j][k])) {
//                          coord = [
//                            Cell.get(lifespans[j][k])!.elHist.ctrd1,
//                            Cell.get(lifespans[j][k])!.elHist.ctrd0,
//                          ];
//                          area = Cell.get(
//                            lifespans[j][k]
//                          )!.cellPolygon;
//                        } else {
//                          let res = await q.queryProp(
//                            lifespans[j][k] as string,
//                            Region
//                          );
//                          if (res) {
//                            Cell.set(lifespans[j][k], res);
//                            setCell(Cell);
//                            coord = [
//                              res!.elHist.ctrd1,
//                              res!.elHist.ctrd0,
//                            ];
//                            area = res!.cellPolygon;
//                            fitEllipse = res!.ellipse;
//                          }
//                        }
//                        if (coord.length > 1) {
//                          singleLine.push(coord);
//                          _point.set(lifespans[j][k], coord);
//                        }
//                        if (area.length > 1) {
//                          _polygon.set(lifespans[j][k], area);
//                        }
//                        if (fitEllipse.length > 1) {
//                          _ellipse.set(lifespans[j][k], fitEllipse);
//                        }
//                      }
//                      _line.set(
//                        lifespans[j][0] + "_" + lifespans[j][l - 1],
//                        singleLine
//                      );
//                    }
//                  }
//                }
//                setPoint(_point);
//                setallPoint(_point);
//                setLine(_line);
//                setallLine(_line);
//                setPolygon(_polygon);
//                setallPolygon(_polygon);
//                setEllipse(_ellipse);
//                setallEllipse(_ellipse);
//              }
//            }}
//          />
//        </Box>
//      </Stack>
//    </Box>
//  )
//) : (
//  <Box />
//)}
//</Stack>
