import Navbar from "../../components/Navbar";
import { Button, Container, Grid, Stack, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Carousel from 'react-material-ui-carousel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { destinationState } from "../../atoms"
import { Destination } from "../../types/Destination";
import removePublic from "../../helpers/formatPath";
import { useRecoilValue } from "recoil";
import { deleteDestination } from "../../services/destinationService";
import { useCallback } from "react";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";



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
  customButton: {
    fontSize: "2rem !important"
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
    marginTop: "54px"
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
  customPagination: {
    color: "#283044 !important",
    alignSelf: "center",
    '& .MuiPaginationItem-root': {
      color: '#283044 !important', // Change color to red
    },
    fontWeight: "bold"
  }
}));

function DestinationPage() {
  const classes = useStyles();
  const navigate = useNavigate()
  const destination: Destination | null = useRecoilValue(destinationState);

  const removeDestination = useCallback(async (id: string) => {

    Swal.fire({
      title: "Do you want to remove this destination?",
      showDenyButton: true,
      confirmButtonText: "remove",
      denyButtonText: `Don't remove`
    }).then(async (result) => {

      if (result.isConfirmed) {
        await deleteDestination(id)
        Swal.fire("Removed!", "", "success");

        navigate("/home")
      } else if (result.isDenied) {
        Swal.fire("Destination is not removed", "", "info");
      }
    });

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
          alignItems="flex-start"
        >
          <Stack direction="row" className={classes.customStack}>
            <Typography variant="h3" className={classes.title}>{destination?.name}</Typography>
            <IconButton className={classes.customButton}  >
              <DeleteIcon className={classes.customIconButton} onClick={() => removeDestination(destination._id)} />
            </IconButton>
          </Stack>
          <Carousel className={classes.carousel}>
            {destination?.pictures.map((image, index) => (

              <img key={index} alt={`Image ${index}`} src={`${import.meta.env.VITE_API_BASE_URL}${removePublic(image)}`} className={classes.image} />
            ))}
          </Carousel>
          <Grid container spacing={2} className={classes.customGrid}>

            <Grid item xs={12} md={6}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" className={classes.customStack}>
                  <Button variant="contained" color="primary" className={classes.button}>Description</Button>
                  <IconButton className={classes.customButton} onClick={() => navigate("/Destination/edit")}  >
                    <EditIcon className={classes.customIconButton} />
                  </IconButton>
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
                  <IconButton className={classes.customButton} onClick={() => navigate("/Destination/edit")}  >
                    <EditIcon className={classes.customIconButton} />
                  </IconButton>
                </Stack>


                <List style={{ marginTop: '10px' }}>
                  {
                    destination.requirements.map(requirement =>
                      <Stack direction="row" style={{ alignItems: "center" }}>
                        <ListItem >
                          <ListItemText primary={requirement.name} className={classes.requirement} />
                        </ListItem>
                        <ExpandCircleDownIcon className={classes.customIconButton} />
                      </Stack>
                    )
                  }

                </List>
              </div>
            </Grid>
          </Grid>

        </Stack>
      </Container>
    </>
  );
}

export default DestinationPage;
