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
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { statistictype } from "../../lib/core/main-content";

dayjs.extend(utc);

const useStyles = makeStyles({
  customTable: {
    position: "relative",
  },
});

export const MainContent: React.FC = ({}) => {
  const q = new Query();
  const [onQuery, setonQuery] = React.useState<boolean>(false);
  const [onTable, setonTable] = React.useState<boolean>(false);
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
  const { Event, eventStatistic, Line, setLine, Point, setPoint } =
    useCellContent();

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

  const classes = useStyles();

  React.useEffect(() => {
    q.queryEventStatistic(Region);
  }, [Event]);

  return (
    <div>
      <_Map />
      <Stack width="95wh" height="95vh" spacing={3}>
        <Grid container width="100%">
          <Grid item xs={4.75} />
          <Grid item xs={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setonQuery(!onQuery)}
            >
              Query
            </Button>
          </Grid>
          <Grid item xs={0.25} />
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setonTable(!onTable)}
            >
              Event Properties
            </Button>
          </Grid>
          <Grid item xs={4} />
        </Grid>
        <Grid container width="100%" height="100%">
          <Grid item width="100%" xs={3.6} marginLeft={1}>
            {onQuery ? (
              <Box
                className={classes.customTable}
                width="100%"
                height="auto"
                sx={{
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: 3,
                }}
              >
                <Stack width="95%" spacing={1.3} marginTop={1} marginBottom={1}>
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
              <Box />
            )}
          </Grid>
          <Grid item xs={4.2} />
          <Grid item width="100%" xs={4} marginRight={1}>
            {onTable && eventStatistic ? (
              <Box
                className={classes.customTable}
                width="100%"
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
                      xs={9.8}
                      marginLeft={1}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography variant="body1">Event Properties</Typography>
                    </Grid>
                    <Grid item width="100%" xs={2}>
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
                      onRowSelectionModelChange={async (newSelection) => {
                        let _point: number[][] = [];
                        let _line: number[][][] = [];
                        let n = newSelection.length;
                        if (n == 0) {
                          setLine(_line);
                          setPoint(_point);
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
                                  let coord = await q.queryProp(
                                    lifespans[j][k] as string,
                                    Region
                                  );
                                  if (coord && coord.length > 1) {
                                    singleLine.push(coord.reverse());
                                    _point.push(coord.reverse());
                                  }
                                }
                                _line.push(singleLine);
                              }
                            }
                          }
                          setPoint(_point);
                          setLine(_line);
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Box />
            )}
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
};
