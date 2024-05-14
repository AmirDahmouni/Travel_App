import Navbar from "../../components/Navbar";
import { Button, Container, Grid, Stack, Typography, Pagination, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import DestinationCard from "../../components/DestinationCard";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect, useState } from "react";
import { Destination } from "../../types/Destination";
import { getDestinations } from "../../services/destinationService";
import { filterState, userDataState } from "../../atoms";
import { useRecoilValue } from "recoil";
import { UserData } from "../../types/User";

const useStyles = makeStyles(() => ({
  container: {
    width: "70%",
  },
  customGrid: {
    marginTop: "10px !important",
    marginLeft: "-15px !important"
  },
  title: {
    color: "#283044",
    fontWeight: "400 !important"
  },
  stack: {
    margin: "10px",
    marginTop: " 54px"
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
  customStack: {
    alignItems: "self-end",
    marginTop: "18px !important"
  },
  customButton: {
    fontSize: "2rem !important"
  },
  customIconButton: {
    fontSize: "larger !important"
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

function HomeAdmin() {
  const classes = useStyles();
  const navigate = useNavigate()

  const userData: UserData | null = useRecoilValue(userDataState);
  const [destinations, setDestinations] = useState<Destination[]>([])

  const filterData: string | null = useRecoilValue(filterState);
  const [page, setPage] = useState<number>(1)


  useEffect(() => {

    const queryParams = {
      keywords: filterData,
      page
    };

    const fetchData = async () => {
      const { data: destinations } = await getDestinations(queryParams)
      setDestinations(destinations)
    };

    fetchData();
  }, [page, filterData])

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
          <Typography variant="h3" className={classes.title}>Hi {userData?.firstname + " " + userData?.lastname}</Typography>
          <Stack direction="row" className={classes.customStack}>

            <Button className={classes.button}>Destinations</Button>
            <IconButton className={classes.customButton} onClick={() => navigate("/Destination/new")}>
              <AddCircleOutlineIcon className={classes.customIconButton} />
            </IconButton>
          </Stack>

          <Grid
            className={classes.customGrid}
            container
            spacing={{ xs: 2, md: 5 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            {
              destinations && destinations.map((destination, index) =>

                <Grid item xs={2} sm={4} md={4} key={index} >
                  <DestinationCard data={destination} />
                </Grid>

              )
            }
          </Grid>
          <Pagination count={3} variant="outlined" className={classes.customPagination} />
        </Stack>
      </Container>
    </>
  );
}

export default HomeAdmin;
