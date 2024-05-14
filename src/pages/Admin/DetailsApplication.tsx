import { Container, Stack, Typography, Button, IconButton, Link } from '@mui/material'
import Navbar from '../../components/Navbar'
import { makeStyles } from "@mui/styles";
import iconnUser from "../../assets/icon_user.png"
import { useCallback, useEffect, useState } from 'react';
import { getApplicationById } from '../../services/applicationService';
import { getDestination } from '../../services/destinationService';
import { useParams } from "react-router";
import ReportIcon from '@mui/icons-material/Report';
import VerifiedIcon from '@mui/icons-material/Verified';
import { CheckApplication } from '../../services/applicationService';
import icon_msg from "../../assets/icon_msg.png"
import Swal from 'sweetalert2';
import { NewMessage } from '../../services/messageService';
import removePublic from '../../helpers/formatPath';


const useStyles = makeStyles(() => ({
  container: {
    width: "70%",
    margin: "164px"
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
  },
  text: {
    fontWeight: "700 !important",
    marginTop: "20px !important",
    fontSize: "20px !important",
    color: "#283044 !important"
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "64px !important",
    width: "120px",
    fontSize: "18px !important",
    fontWeight: "600 !important",
    borderRadius: "15px !important",
    padding: "10px !important"
  },
  requirement: {
    fontWeight: "700 !important",
    fontSize: "20px !important",
    marginTop: "10px !important",
    color: "#283044 !important"
  },
  customButton: {
    fontSize: "1.5rem !important"
  },
  customIconButton: {
    fontSize: "larger !important"
  },
  verifiedIcon: {
    fontSize: "larger !important",
    color: "green"
  },
  reportIcon: {
    fontSize: "larger !important",
    color: "red"
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

export default function DetailsApplication() {
  const classes = useStyles();
  const [application, setApplication] = useState()
  const [destination, setDestination] = useState({})

  const { id } = useParams()


  const documentUploaded = useCallback((id: string) => {
    return application?.documents?.find(document => document.type == id)
  }, [application])

  const getPathdocument = useCallback((id: string) => {
    const path = application?.documents?.find(document => document.type == id).path
    return removePublic(path)
  }, [application])

  useEffect(() => {

    const fetchData = async () => {

      const { data: application } = await getApplicationById(id)

      const { data: destination } = await getDestination(application.destination)

      setApplication(application)

      setDestination(destination)

    };

    fetchData();

  }, [id, application])

  const validate = useCallback(async (decision: string) => {

    Swal.fire({
      title: "Do you want to confirm the decision?",
      showDenyButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: `Don't confirm`
    }).then(async (result) => {

      if (result.isConfirmed) {

        await CheckApplication(application?._id, decision)
        Swal.fire(`${decision} !`, "", "success");

      } else if (result.isDenied) {
        Swal.fire("Decision is not saved", "", "info");
      }
    });


  }, [application])


  const handlePopUp = useCallback(() => {
    Swal.fire({
      title: "Submit your Message",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Send",
      showLoaderOnConfirm: true,
      preConfirm: async (message) => {
        try {
          const { data } = await NewMessage(application?._id, application?.traveler?._id, message);

          if (data) {
            return data.message; // Return the message sent upon success
          }
          throw new Error('Failed to send message');
        } catch (error) {
          Swal.showValidationMessage(`Failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: `Message sent to ${application?.traveler?.firstname}`,
          icon: "success"
        });
      }
    });
  }, [application]);


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
              {application?.traveler?.firstname} {application?.traveler?.lastname} Requested
            </Typography>
            <img src={icon_msg} style={{ width: "50px", cursor: "pointer" }} onClick={handlePopUp} />
          </Stack>

          <Typography variant="body1" className={classes.text}>
            Destination requested : {destination.name}
          </Typography>
          <Typography variant="body1" className={classes.text}>
            Requirements uploaded :
          </Typography>

          <Container style={{ marginTop: "20px" }}>
            {destination.requirements && destination.requirements.map(requirement =>
              <Stack direction="row" alignItems="center" justifyContent="center" >
                <Typography variant="body1" className={classes.requirement} >
                  {requirement.name}
                </Typography>

                <IconButton className={classes.customButton}  >
                  {documentUploaded(requirement._id) ?
                    <Link href={`${import.meta.env.VITE_API_BASE_URL}${getPathdocument(requirement._id)}`}>
                      <VerifiedIcon className={classes.verifiedIcon} />
                    </Link>
                    :
                    <ReportIcon className={classes.reportIcon} />
                  }
                </IconButton>

              </Stack>
            )}

          </Container>
          {application?.validated != "accepted" && (
            <Stack direction="row" spacing={3} style={{ marginTop: "24px" }}>
              <Button className={classes.approveBtn} onClick={() => validate("accepted")}>Approve</Button>
              <Button className={classes.denyBtn} onClick={() => validate("refused")}>Deny</Button>
            </Stack>
          )}

        </Stack>
      </Container>
    </>

  )
}
