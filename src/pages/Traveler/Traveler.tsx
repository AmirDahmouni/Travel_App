import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar'
import DestinationCard from "../../components/DestinationCard";
import { Container, Button, Stack, Typography, Grid, Pagination } from '@mui/material'
import { makeStyles } from "@mui/styles";
import { applicationsState, filterState, filterstate, userDataState } from '../../atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getDestinations } from '../../services/destinationService';
import { Destination } from '../../types/Destination';
import { getMyapplications } from '../../services/userService';

const useStyles = makeStyles(() => ({
  container: {
    width: "70%"
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

export default function HomeTraveler() {
  const classes = useStyles();

  const userData: UserData | null = useRecoilValue(userDataState);
  const [_, setApplications] = useRecoilState(applicationsState)
  const [destinations, setDestinations] = useState<Destination[]>([])

  const filterData: string | null = useRecoilValue(filterState);
  const [page, setPage] = useState<number>(1)


  useEffect(() => {

    const fetchApplications = async () => {
      const { applications } = await getMyapplications()
      setApplications(applications);
    }
    fetchApplications()

  }, [])

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
          <Typography variant="h3" className={classes.title}>Hi {userData.firstname + " " + userData.lastname}</Typography>
          <Stack direction="row" className={classes.customStack}>
            <Button className={classes.button}>Destinations</Button>
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
  )
}
