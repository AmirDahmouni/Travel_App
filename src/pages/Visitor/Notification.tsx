import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar';
import { Container, Stack, Typography } from '@mui/material'
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import iconnUser from "../../assets/icon_user.png"
import { userDataState } from '../../atoms';
import { useRecoilValue } from 'recoil';
import { UserData } from '../../types/User';
import { getApprovedRequests } from '../../services/requestService';
import formatDateTime from '../../helpers/formatDateTime';

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

export default function NotificationsVisitor() {

  const classes = useStyles();

  const userData: UserData | null = useRecoilValue(userDataState);

  const [requests, setRequests] = useState([])


  useEffect(() => {
    const requestFetch = async () => {
      const { data } = await getApprovedRequests()
      setRequests(data)
    }

    requestFetch()

  }, [])

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
            <Typography variant="h4" className={classes.request}> {userData?.firstname} : Notifications</Typography>
          </Stack>

          {requests && requests.map(request =>
            <Typography variant="h5" className={classes.request}>
              Your visit to {request.visit_to} due {formatDateTime(request.date_visit)} has been
              <Typography variant="h5" style={{ color: "green" }}>approved</Typography>

            </Typography>
          )}

        </Stack>
      </Container>
    </>
  )
}
