import { _Map } from "./map";
import * as React from "react";
import { makeStyles } from "@material-ui/core";
import { Stack, Grid, Button, Box, MenuItem, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const useStyles = makeStyles({
  customTable: {
    position: "relative",
  },
});

export const MainContent: React.FC = ({}) => {
  const [onQuery, setonQuery] = React.useState<boolean>(false);
  const [startDate, setstartDate] = React.useState<Dayjs | null>(
    dayjs("2022-04-17").utc()
  );
  const [startTime, setstartTime] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T15:30").utc()
  );
  const [endDate, setendDate] = React.useState<Dayjs | null>(
    dayjs("2022-04-17").utc()
  );
  const [endTime, setendTime] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T15:30").utc()
  );
  const [Region, setRegion] = React.useState("UK");

  const classes = useStyles();
  return (
    <>
      <_Map />
      <Stack width="100wh" height="100vh">
        <Grid container width="100%">
          <Grid item xs={4.75} />
          <Grid item xs={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setonQuery(!onQuery);
              }}
            >
              Query
            </Button>
          </Grid>
          <Grid item xs={0.25} />
          <Grid item xs={2}>
            <Button fullWidth variant="contained">
              Cell Properties
            </Button>
          </Grid>
          <Grid item xs={4} />
        </Grid>
        <Grid container width="100%" height="100%">
          <Grid item width="100%" xs={3.6}>
            {onQuery ? (
              <Box
                className={classes.customTable}
                width={onQuery ? "100%" : "0px"}
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

                        console.log(combinedEndDateTime?.toISOString());
                      }}
                    >
                      Query
                    </Button>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Box />
            )}
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};
