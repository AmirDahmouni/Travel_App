import Navbar from "../../components/Navbar";
import { Button, Container, Grid, Stack, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Carousel from 'react-material-ui-carousel';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { applicationsState, destinationState } from "../../atoms";
import { useRecoilValue } from "recoil";
import removePublic from "../../helpers/formatPath";
import { useCallback, useEffect, useState } from "react";
import formatDateTime from "../../helpers/formatDateTime";
import VerifiedIcon from '@mui/icons-material/Verified';


const useStyles = makeStyles(() => ({
  container: {
    width: "70%"
  },
  carousel: {
    width: '100%',
    height: '360px',
    border: "3px solid",
    borderColor: "#283044",
    borderRadius: "15px"
  },
  customGrid: {
    marginTop: "0px !important",
    marginLeft: "-15px !important"
  },
  image: {
    width: "100%",
    height: "360px"
  },
  customListItemText: {
    fontWeight: "400"
  },
  title: {
    color: "#283044",
    fontWeight: "400 !important"
  },
  customStack: {
    alignItems: "self-end"

  },
  customIconButton: {
    fontSize: "larger !important"
  },
  description: {
    marginTop: "30px !important",
    display: "flex",
    flex: "start",
    textAlign: "justify",
    fontSize: "24px !important"
  },
  requirement: {
    marginTop: "5px !important",
    display: "flex",
    flex: "start",
    fontWeight: "700 !important"
  },
  stack: {
    margin: "10px",
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "24px !important",
    width: "160px",
    fontSize: "16px !important",
    fontWeight: "400 !important",
    borderRadius: "30px !important",
    padding: "12px !important"
  },
  history: {
    alignSelf: "flex-start",
    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "24px !important",
    width: "200px",
    fontSize: "16px !important",
    fontWeight: "400 !important",
    borderRadius: "30px !important",
    padding: "12px !important"
  },
  Applybutton: {
    alignSelf: "flex-start",
    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "24px !important",
    width: "80px",
    fontSize: "14px !important",
    fontWeight: "600 !important",
    borderRadius: "8px !important",
    padding: "8px !important"
  },
  customPagination: {
    color: "#283044 !important",
    alignSelf: "center",
    '& .MuiPaginationItem-root': {
      color: '#283044 !important', // Change color to red
    },
    fontWeight: "bold"
  },
  verifiedIcon: {
    fontSize: "larger !important",
    color: "green"
  },
}));

function DestinationTraveler() {
  const classes = useStyles();
  const destination: Destination | null = useRecoilValue(destinationState);
  const applications: Application[] | null = useRecoilValue(applicationsState);

  const [lastApplications, setLastApplication] = useState([])


  const [statusApplication, setStatusApplication] = useState<string>("new")

  useEffect(() => {
    const applicationExist = applications.find(application => application.destination._id == destination._id
      && (application.validated == "refused" || application.validated == "pending"))


    if (applicationExist)
      setStatusApplication(applicationExist.validated)

    const applicationsCurrentDestiantion = applications.filter(application =>
      application.destination._id == destination._id
      && application.validated == "accepted")

    setLastApplication(applicationsCurrentDestiantion)
  }, [applications])

  const navigate = useNavigate()

  const handleNavigation = useCallback(() => {

    if (statusApplication === "new") navigate(`/application/`)
    else {

      const application = applications.find(application => application.destination._id == destination._id
        && application.validated != "accepted")

      navigate(`/application/${application._id}`)
    }
  }, [statusApplication])



  return (
    <>
      <Navbar />
      <Container className={classes.container}>
        <Stack
          className={classes.stack}
          direction="column"
          justifyContent="center"
          spacing={5}
          alignItems="flex-start"
        >
          <Stack direction="row" className={classes.customStack} style={{ gap: "16px" }}>

            <Typography variant="h3" className={classes.title}>{destination?.name}</Typography>
            <Button variant="contained" color="primary" className={classes.Applybutton}
              onClick={handleNavigation}
            >
              {statusApplication == "new" ? "Apply" : "Update"}

            </Button>
          </Stack>


          <Carousel className={classes.carousel}>
            {destination?.pictures.map((image: string, index: number) => (

              <img key={index} alt={`Image ${index}`} src={`${import.meta.env.VITE_API_BASE_URL}${removePublic(image)}`} className={classes.image} />
            ))}
          </Carousel>
          <Grid container spacing={2} className={classes.customGrid}>

            <Grid item xs={12} md={6}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" className={classes.customStack}>
                  <Button variant="contained" color="primary" className={classes.button}>Description</Button>
                </Stack>

                <Typography variant="body1" className={classes.description}>
                  {destination?.description}
                </Typography>
              </div>
            </Grid>

            {/* Second Column */}
            <Grid item xs={12} md={6}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" className={classes.customStack}>
                  <Button variant="contained" color="primary" className={classes.button}>Requirements</Button>
                </Stack>

                <List style={{ marginTop: '10px' }}>
                  {destination.requirements.map((requirement: any) =>
                    <Stack direction="row" style={{ alignItems: "center" }}>
                      <ListItem >
                        <ListItemText primary={requirement.name} className={classes.requirement} />
                      </ListItem>
                      <ExpandCircleDownIcon className={classes.customIconButton} />
                    </Stack>
                  )}
                </List>
              </div>
            </Grid>


            <Grid item xs={12} md={12}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" className={classes.customStack}>
                  <Button variant="contained" color="primary" className={classes.history}>Missions history</Button>
                </Stack>

                <List style={{ marginTop: '10px' }}>
                  {lastApplications.map((application: any) =>
                    <Stack direction="row" style={{ alignItems: "center", whiteSpace: "discard-after" }}>
                      <Link to={`/application/${application._id}`} style={{ textDecoration: "none", color: "black", fontWeight: "bold" }}>
                        <ListItem >
                          {"Application : "}
                          <ListItemText primary={formatDateTime(application.dateTime)} className={classes.requirement} />
                          <VerifiedIcon className={classes.verifiedIcon} />

                        </ListItem>
                      </Link>

                    </Stack>
                  )}
                </List>
              </div>
            </Grid>
          </Grid>

        </Stack>
      </Container >
    </>
  );
}

export default DestinationTraveler;
