import Navbar from '../../components/Navbar';
import { Container, MenuItem, Select, Stack, Typography } from '@mui/material'
import { makeStyles } from "@mui/styles";
import iconnUser from "../../assets/icon_user.png"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getByStatusRequests } from '../../services/requestService';

const useStyles = makeStyles(() => ({
  container: {
    width: "80%",
    margin: "164px",
    marginTop: "75px"
  },
  stack: {
    width: "70%",
    margin: "auto"
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

export default function HomeSos() {
  const classes = useStyles();


  const [status, setStatus] = useState<string>("pending")
  const [requests, setRequests] = useState([])

  useEffect(() => {

    const fetchRequest = async () => {
      const { data } = await getByStatusRequests(status)
      setRequests(data)
    }
    fetchRequest()

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


          <Stack
            direction="column"
            justifyContent="center"
            spacing={5}
            alignItems="center">
            <Select fullWidth value={status} onChange={(e) => setStatus(e.target.value)}  >
              <MenuItem value="pending">Pending requests</MenuItem>
              <MenuItem value="approved">approved requests</MenuItem>

            </Select>
            {
              requests && requests.map(request =>
                <Stack direction="row" spacing={2}>
                  <img src={iconnUser} className={classes.img} />
                  <Link to={`/Notification/${request._id}`} style={{ textDecoration: "none", cursor: "pointer" }}>
                    <Typography variant="h6" className={classes.request}>
                      {request.visitor?.firstname} Requested
                    </Typography>
                  </Link>

                </Stack>
              )
            }

          </Stack>

        </Stack>
      </Container >
    </>
  )
}
