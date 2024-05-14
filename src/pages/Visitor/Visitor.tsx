import React, { useCallback, useState } from 'react'
import Navbar from '../../components/Navbar';
import { Container, Grid, Stack, Typography, Select, MenuItem, Tooltip, Button, TextField } from '@mui/material'
import { makeStyles } from "@mui/styles";
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from "react-router-dom";
import iconnUser from "../../assets/icon_user.png"
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { applyRequest } from '../../services/requestService';
import Swal from 'sweetalert2';
import { userDataState } from '../../atoms';
import { useRecoilValue } from 'recoil';

const useStyles = makeStyles(() => ({
  container: {
    width: "80%",
    margin: "164px",
    marginTop: "75px"
  },
  stack: {
    width: "70%",
    margin: "auto",
    placeItems: "baseline !important"
  },
  request: {
    color: "#283044 !important"
  },
  img: {
    backgroundColor: "#283044 !important",
    borderRadius: "20px",
    padding: "5px"
  },
  label: {
    fontSize: "18px",
    fontWeight: "500 !important",
    textAlign: "left"
  },
  select: {
    width: "100%",
    backgroundColor: "lightgray"
  },
  input: {
    backgroundColor: "lightgray"
  },
  saveButton: {
    alignSelf: "center",
    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "24px !important",
    width: "150px",
    fontSize: "14px !important",
    fontWeight: "500 !important",
    borderRadius: "8px !important",
    padding: "8px !important"
  }
}))

export default function HomeVisitor() {

  const classes = useStyles();
  const navigate = useNavigate()

  const userData: UserData | null = useRecoilValue(userDataState);

  const [person, setPerson] = useState<string>('');


  const [ltn, setLtn] = useState<number>(0)
  const [ltns, setLtns] = useState<number[]>([1, 2, 3, 4])

  const [dateVisit, setDateVisit] = useState<Dayjs | null>()


  const handleChangeLtn = (event: SelectChangeEvent<string>) => {
    setLtn(event.target.value as number);
  };

  const apply = useCallback(async () => {
    if (person.length != 0 && ltn != 0 && dateVisit) {
      const datetime = new Date(dateVisit?.toDate().toString());

      Swal.fire({
        title: "Are you sure ?",
        showDenyButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await applyRequest(person, ltn, datetime)
            Swal.fire("Saved !", "", "success");
            navigate("/notifications")
          }
          catch (err) {
            Swal.fire("Request is not saved", "", "error");
          }
        } else if (result.isDenied) {
          Swal.fire("Request is not saved", "", "info");
        }
      });
    }
    else Swal.fire("Field(s) empty", "", "error");

  }, [person, ltn, dateVisit])



  return (
    <>
      <Navbar />
      <Container className={classes.container}>
        <Stack
          className={classes.stack}
          direction="column"
          justifyContent="center"
          spacing={5}
          alignItems="center"
        >
          <Stack direction="row" spacing={2}>
            <img src={iconnUser} className={classes.img} />
            <Typography variant="h4" className={classes.request}>
              {"Hi " + userData?.firstname + " " + userData?.lastname + "!"}
            </Typography>
          </Stack>
          <Grid container spacing={2} style={{ padding: "24px" }}>
            <Grid item xs={12} sm={4} md={4} lg={4} >
              <Grid container spacing={2}  >
                <Grid item xs={12} className={classes.label}>
                  Who are you visiting ?
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth value={person} onChange={(e) => setPerson(e.currentTarget.value)} variant="outlined" className={classes.input} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.label}>
                  In which LTN ?
                </Grid>
                <Grid item xs={12} >
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={ltn}
                    label="Extesion"
                    onChange={handleChangeLtn}
                    className={classes.select}
                  >
                    {ltns.map((ltn) => (
                      <MenuItem key={ltn} value={ltn}>
                        {`LTN ${ltn}`}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.label}>
                  When will it be ?
                </Grid>
                <Grid item xs={12} >
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoItem >
                      <DateTimePicker className={classes.select}
                        value={dayjs(dateVisit)}
                        onChange={(newValue) => setDateVisit(dayjs(newValue))}
                      />
                    </DemoItem>
                  </LocalizationProvider>

                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" className={classes.saveButton}
            onClick={apply}
          >
            Apply
          </Button>
        </Stack>
      </Container>
    </>
  )
}
