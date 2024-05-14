import React, { useCallback, useEffect, useState } from 'react'
import { getApplications } from '../../services/applicationService';
import { makeStyles } from "@mui/styles";
import Navbar from '../../components/Navbar';
import { Stack, Container, Typography, MenuItem, Select } from '@mui/material';
import iconnUser from "../../assets/icon_user.png"
import { Link, useNavigate } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useRecoilValue } from 'recoil';
import { applicationsState } from '../../atoms';
import { set } from 'date-fns';

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

export default function MyApplications() {
  const classes = useStyles();

  const navigate = useNavigate()

  const AllApplications: [] | null = useRecoilValue(applicationsState);
  const [applications, setApplications] = useState([])
  const [status, setStatus] = useState("pending")

  useEffect(() => {
    const applications = AllApplications?.filter(application => application.validated == status)
    setApplications(applications)
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
                  {
                    application.validated == "pending" &&
                    <Typography variant="h6" className={classes.request}>
                      Your application to {application?.destination.name} is  <Typography variant="h6" style={{ color: "yellow" }}>pending </Typography>
                    </Typography>
                  }
                  {
                    application.validated == "accepted" &&
                    <Typography variant="h6" className={classes.request}>
                      Your application to {application?.destination.name} has been  <Typography variant="h6" style={{ color: "green" }}> accepted </Typography>
                    </Typography>
                  }
                  {
                    application.validated == "refused" &&
                    <Typography variant="h6" className={classes.request}>
                      Your application to {application?.destination.name} is  <Typography variant="h6" style={{ color: "red" }}>refused </Typography>
                    </Typography>
                  }


                </Stack>
              </Link>
            )}

          </Stack>

        </Stack>
      </Container >
    </>
  )
}
