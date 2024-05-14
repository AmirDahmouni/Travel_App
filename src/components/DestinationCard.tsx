import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from "@mui/styles";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import removePublic from '../helpers/formatPath';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Destination } from '../types/Destination';
import { destinationState } from "../atoms"
import destination_default from "../assets/destination_default.jpg"


const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    height: "240px",
    border: '3px solid #283044',
    borderRadius: "10px !important",
    backgroundColor: "#D9D9D9 !important"
  },
  carouselContainer: {
    width: '50%',
    position: 'relative',
    overflow: 'inherit',
    backgroundSize: 'cover', // Make the background cover the entire carousel container
    backgroundPosition: 'center', // Center the background image
  },
  carousel: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '50%',
    padding: "8px !important",
  },
  title: {
    display: "flex",
    flex: "start",
    fontSize: "17px !important",
    fontWeight: " 600 !important"
  },
  description: {
    fontSize: "16px !important",
    textAlign: "left",
    margin: "2px !important"
  },
  rating: {
    fontSize: "1.1rem !important"
  }
}));

function DestinationCard({ data }: any) {

  const classes = useStyles();
  const navigate = useNavigate()
  const { name, description, pictures: images } = data

  const [, setDestination] = useRecoilState<Destination>(destinationState);
  const [cover, setCover] = useState("")

  const handleDetailsPage = useCallback(() => {
    setDestination(data)
    navigate("/Destination/details")

  }, [data])

  useEffect(() => {
    let url
    if (images[0])
      url = import.meta.env.VITE_API_BASE_URL + "" + removePublic(images[0])
    else url = destination_default

    setCover(url)
  }, [data])

  return (
    data &&
    <Card className={classes.card} style={{ cursor: 'pointer' }} onClick={handleDetailsPage}  >
      <div className={classes.carouselContainer} style={{ backgroundImage: `url(${cover})` }}>

        <IconButton aria-label="like" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Your like icon here */}
        </IconButton>
      </div>
      <CardContent className={classes.content}>
        <Typography variant="h5" gutterBottom className={classes.title}>
          {name}
        </Typography>
        {/*<Stack direction="row" spacing={1} alignItems="center" alignContent={'flex-start'}>
          <Rating name="rating" value={3} readOnly className={classes.rating} />
          <Typography variant="body2">Remark</Typography>
          </Stack>*/}
        <Typography variant="body1" className={classes.description} >
          {description}
        </Typography>
      </CardContent>
    </Card >
  );
}

export default DestinationCard;


