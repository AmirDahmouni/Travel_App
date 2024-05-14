import React, { useEffect, useState } from 'react'
import { getApplications } from '../../services/applicationService';
import { makeStyles } from "@mui/styles";
import Navbar from '../../components/Navbar';
import { Stack, Container, Typography, MenuItem, Select } from '@mui/material';
import iconnUser from "../../assets/icon_user.png"
import { Link, useNavigate } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "48px",
    width: "70%",
  },
  stack: {
    margin: "8px",
  },
  request: {
    color: "#283044 !important"
  },
  img: {
    backgroundColor: "#283044 !important",
    borderRadius: "20px",
    padding: "5px"
  }
}))

export default function Applications() {
  const classes = useStyles();

  const [applications, setApplication] = useState([])
  const [status, setStatus] = useState("pending")

  useEffect(() => {

    const fetchData = async () => {
      const { data: applications } = await getApplications(status)
      setApplication(applications)
    };

    fetchData();
  }, [status])


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
          <NotificationsNoneIcon fontSize="large" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "50%" }}  >
            <MenuItem value="pending">Pending applications</MenuItem>
            <MenuItem value="refused">Refused applications</MenuItem>
            <MenuItem value="accepted">Accepted applications</MenuItem>
          </Select>

          <Stack
            direction="column"
            justifyContent="center"
            spacing={5}
            alignItems="center">
            {applications && applications.map(application =>
              <Link to={`/Application/${application._id}`} style={{ textDecoration: "none", cursor: "pointer" }}>
                <Stack direction="row" spacing={2}>
                  <img src={iconnUser} className={classes.img} />
                  <Typography variant="h4" className={classes.request}>
                    {application.traveler.firstname} {application.traveler.lastname} Requested
                  </Typography>
                </Stack>
              </Link>
            )}
          </Stack>
        </Stack>
      </Container >
    </>
  )
}
