import { Container, Stack, Typography, IconButton, Button } from '@mui/material'
import { makeStyles } from "@mui/styles";
import Navbar from '../../components/Navbar'
import { applicationsState, destinationState, userDataState } from '../../atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Destination } from '../../types/Destination';
import { NewApplication, UpdateApplication } from '../../services/applicationService';
import { useCallback, useEffect, useState } from 'react';
import { Application } from '../../types/Applications';
import ReportIcon from '@mui/icons-material/Report';
import VerifiedIcon from '@mui/icons-material/Verified';
import icon_msg from "../../assets/icon_msg.png"
import Swal from 'sweetalert2';
import { getMessagesByApplication, validateMessages } from '../../services/messageService';
import formatDateTime from '../../helpers/formatDateTime';
import { useNavigate, useParams } from 'react-router-dom';
import { getDestination } from '../../services/destinationService';

const useStyles = makeStyles(() => ({
  container: {
    width: "70%",
    margin: "auto",
    marginTop: "48px",
    marginBottom: "48px"
  },
  stack: {
    width: "70%",
    margin: "auto",
  },
  request: {
    color: "#283044 !important"
  },
  destination: {
    fontSize: "2rem !important",
    fontWeight: "700 !important",
    alignSelf: "start !important",

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
  requirement: {
    fontWeight: "700 !important",
    fontSize: "20px !important",
    marginTop: "10px !important",
    color: "#283044 !important"
  },
  customButton: {
    fontSize: "1.5rem !important"
  },
  verifiedIcon: {
    fontSize: "larger !important",
    color: "green"
  },
  reportIcon: {
    fontSize: "larger !important",
    color: "red"
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
    padding: "8px !important"
  },
  requirements: {
    alignSelf: "center",
    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "64px !important",
    width: "50%",
    fontSize: "16px !important",
    fontWeight: "600 !important",
    borderRadius: "15px !important",
    padding: "10px !important"
  }
}))


export default function ApplicationPage() {
  const classes = useStyles();
  const destination: Destination | null = useRecoilValue(destinationState);
  const [, setDestination] = useRecoilState<Destination>(destinationState);
  const applications: Application[] | null = useRecoilValue(applicationsState);
  const userData: User | null = useRecoilValue(userDataState);

  const [uploadedDocsIds, setUploadedDocsIds] = useState<string[]>([])
  const [currentApplication, setCurrentApplication] = useState<any>()

  const [messages, setMessages] = useState([])

  //new refused accepted
  const [status, setStatus] = useState<string>("")


  const navigate = useNavigate()
  const { id } = useParams()

  const formData = new FormData()

  useEffect(() => {

    if (id) {
      // refused app or pending app

      const currentApplication = applications.find(application => application._id == id
        && application.traveler == userData._id)


      if (currentApplication) setStatus(currentApplication.validated) //return pending or refused



      if (currentApplication) {

        /**const currentApplication = applications.find(application => application._id == id
          && application.traveler == userData._id && application?.validated != "pending")**/

        const fetchMessage = async () => {
          if (currentApplication) {
            const { data } = await getMessagesByApplication(currentApplication?._id)

            setMessages(data)
          }

        };
        fetchMessage()

        const uploadedDocsIds = currentApplication?.documents?.map((document: any) => document.type._id)

        setCurrentApplication(currentApplication)
        setUploadedDocsIds(uploadedDocsIds)

        const fetchDestination = async () => {

          const { data: destination } = await getDestination(currentApplication.destination._id)

          setDestination(destination)
        }
        fetchDestination()

      }
    }


  }, [applications, status])


  const handleFileUpload = (event: any, requirement: any) => {
    const file = event.target.files[0];
    formData.append(requirement.name, file)

    if (currentApplication && uploadedDocsIds.includes(requirement._id)) {
      const document = currentApplication?.documents?.find(document => document.type.name == requirement.name)
      formData.append("removedDocs", document._id)
    }

  };

  const applyApplication = useCallback(async () => {

    const nbVisits = applications.filter(application => application.destination._id == destination._id
      && application.validated == "accepted").length


    const nextVisit = (nbVisits != 0) ? (nbVisits + 1).toString() : ""


    formData.append("destination", destination?._id.toString())
    formData.append("nbVisit", nextVisit)

    try {

      await NewApplication(formData)
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Your application to ${destination?.name} has been sent`,
        showConfirmButton: false,
        timer: 2000
      });
      navigate("/home")
    }
    catch (err) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Your application to ${destination?.name} has been failed`,
        showConfirmButton: false,
        timer: 2000
      });
      formData.delete("destination")
      formData.delete("nbVisit")
    }
  }, [formData])


  const updateApplication = useCallback(async () => {

    try {
      formData.append("destination", destination?._id.toString())
      await UpdateApplication(currentApplication._id, formData)
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Success updating application to ${destination?.name}`,
        showConfirmButton: false,
        timer: 2000
      });
      navigate("/home")
    }
    catch (err) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Update application to ${destination?.name} has been failed`,
        showConfirmButton: false,
        timer: 2000
      });
      formData.delete("destination")
    }

  }, [formData, currentApplication])




  const handlePopUp = useCallback(() => {
    Swal.fire({
      icon: "info",
      html: messages.map(message => `<div><strong>${message.content}</strong> : ${formatDateTime(message.dateTime)}</div>`).join(''), // Join messages with no delimiter
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: `Great!`,
      confirmButtonAriaLabel: "Thumbs up, great!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const ids = messages.map(message => message._id)
        await validateMessages(ids)
        setMessages([])

      }
    });
  }, [messages]);

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
          <Stack direction="row" spacing={2} style={{ alignItems: "self-end" }}>
            <Typography variant="body1" className={classes.destination} >
              {destination?.name}
            </Typography>
            <img src={icon_msg} style={{ width: "33px", height: "33px", cursor: "pointer" }} onClick={handlePopUp} />
          </Stack>
          <Button className={classes.requirements}>Destinations Requirements</Button>
          <Container style={{ marginTop: "20px" }}>
            {
              destination.requirements.map(requirement =>
                <Stack direction="row" alignItems="self-start" gap={2} justifyContent="center" >
                  <Typography variant="body1" className={classes.requirement} >
                    {requirement.name}
                  </Typography>
                  <IconButton className={classes.customButton}  >
                    <input
                      accept={`.${requirement.extension}`}
                      className={classes.inputfile}
                      id="upload-file"
                      type="file"
                      onChange={(e) => handleFileUpload(e, requirement)}
                    />
                    {
                      uploadedDocsIds.includes(requirement._id) ? <VerifiedIcon className={classes.verifiedIcon} /> :
                        <ReportIcon className={classes.reportIcon} />
                    }

                  </IconButton>

                </Stack>
              )
            }
          </Container>
          {(status != "accepted") &&
            <Button className={classes.button} onClick={status == "" ? applyApplication : updateApplication}>
              {status == "" ? "Apply" : "Update"}
            </Button>
          }
        </Stack>
      </Container>
    </>
  )
}
