import Navbar from '../../components/Navbar';
import { Button, Container, Stack, Typography } from '@mui/material'
import { makeStyles } from "@mui/styles";
import iconnUser from "../../assets/icon_user.png"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { getRequestById } from '../../services/requestService';
import formatDateTime from '../../helpers/formatDateTime';
import { validateRequestById } from '../../services/requestService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
  visit: {
    color: "#283044 !important",
    fontSize: "18px !important",
    fontWeight: "500 !important"
  },
  approveBtn: {
    alignSelf: "center",
    backgroundColor: "#0C9B00 !important",
    color: "white !important",
    marginTop: "24px !important",
    width: "150px",
    fontSize: "14px !important",
    fontWeight: "500 !important",
    borderRadius: "40px !important",
    padding: "8px !important"
  },
  denyBtn: {
    alignSelf: "center",
    backgroundColor: "#BE0000 !important",
    color: "white !important",
    marginTop: "24px !important",
    width: "150px",
    fontSize: "14px !important",
    fontWeight: "500 !important",
    borderRadius: "40px !important",
    padding: "8px !important"
  }
}))

export default function NotificationSos() {
  const classes = useStyles();
  const [request, setRequest] = useState()
  const navigate = useNavigate()

  const { id } = useParams()

  useEffect(() => {

    const fetchRequest = async (id: string) => {
      const { data } = await getRequestById(id)
      setRequest(data)
    }
    if (id) {
      fetchRequest(id)
    }

  }, [])

  const handleValidate = useCallback(async (status: string) => {

    Swal.fire({
      title: "Are you sure ?",
      showDenyButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await validateRequestById(id, status)

          if (status == "approved")
            Swal.fire("Approved !", "", "success");
          else
            Swal.fire("Denied !", "", "success");

          navigate("/Home")
        }
        catch (err) {
          Swal.fire("Request is not saved", "", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Request is not saved", "", "info");
      }
    });
  }, [id])

  return (request &&
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

            <Stack direction="row" spacing={2}>
              <img src={iconnUser} className={classes.img} />
              <Typography variant="h4" className={classes.request}>
                {request.visitor.firstname + " " + request.visitor.lastname} Requested</Typography>
            </Stack>

            <Typography variant="body1" className={classes.visit}>
              Visit to Mr/Mrs {request.visit_to} in LTN {request.LTN} due {formatDateTime(request.date_visit)}
            </Typography>

            {
              request.status == "pending" ?
                <Stack direction="row" spacing={3} style={{ marginTop: "24px" }}>
                  <Button className={classes.approveBtn} onClick={() => handleValidate("approved")}>Approve</Button>
                  <Button className={classes.denyBtn} onClick={() => handleValidate("denied")}>Deny</Button>
                </Stack> :

                <Button className={classes.approveBtn}>Approved</Button>
            }






          </Stack>

        </Stack>
      </Container >
    </>
  )
}
