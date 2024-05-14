import React, { useCallback, useEffect, useState } from 'react'
import { Stack, Grid, Container, IconButton, Typography, TextField, Checkbox, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { makeStyles } from "@mui/styles";
import Navbar from '../../components/Navbar';
import berlin from "../../assets/napoli2.jpg"
import paris from "../../assets/paris1.jpeg"
import italie from "../../assets/napoli1.jpeg"
import FolderIcon from '@mui/icons-material/Folder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRecoilValue } from 'recoil';
import { Destination } from '../../types/Destination';
import { destinationState } from "../../atoms"
import { getAllTypesDocument } from '../../services/typeDocService';
import removePublic from '../../helpers/formatPath';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { updateDestination } from '../../services/destinationService';
import Swal from 'sweetalert2';



const useStyles = makeStyles(() => ({
  container: {
    width: "90%",
    margin: "60px"
  },
  image: {
    height: "300px",
    width: "100% !important",
    border: "3px solid",
    borderColor: "#283044",
    borderRadius: "5px",
    opacity: "0.9"
  },
  title: {
    color: "#283044",
    fontWeight: "400 !important",
    marginBottom: " 16px !important",
    textAlign: "left"
  },
  customIconButton: {
    fontSize: "4rem !important",
    alignContent: "center"
  },
  gridAdd: {
    alignContent: "space-evenly"

  },
  customGrid: {
    marginBottom: "64px !important",
  },
  customContainer: {
    marginTop: "32px !important",
    padding: "0px !important"
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "24px !important",
    width: "160px",
    fontSize: "16px !important",
    fontWeight: "400 !important",
    borderRadius: "30px !important",
    padding: "12px !important"
  },
  input: {
    backgroundColor: "lightgray"
  },
  deleteButton: {
    position: 'absolute',
    top: "-300px",
    right: "-210px"
  },


}));

export default function EditDestination() {
  const classes = useStyles();
  const destination: Destination | null = useRecoilValue(destinationState);

  const navigate = useNavigate()

  const [name, setName] = useState(destination?.name)
  const [description, setDescription] = useState(destination?.description)
  const [selectedRequirements, setSelectedRequirements] = useState<any[]>([])
  const [requirements, setRequirements] = useState<any[]>([])

  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [images, setImages] = useState(destination?.pictures)

  const [newImages, setNewImages] = useState<any[]>([]);

  const handleFileChange = (event: any) => {
    setNewImages(Array.from(event.target.files));
  };


  useEffect(() => {
    const fetchData = async () => {
      const typeDocs = await getAllTypesDocument()
      setRequirements(typeDocs)
    };

    fetchData();
    const requirementsIds = destination.requirements.map(requirement => requirement._id)
    setSelectedRequirements(requirementsIds)
  }, [])


  const handleDoc = useCallback((id: string) => {
    if (selectedRequirements.includes(id)) {
      setSelectedRequirements(selectedRequirements.filter((reqId) => reqId != id))
    } else {
      setSelectedRequirements([...selectedRequirements, id])
    }
  }, [selectedRequirements])

  const deletePicture = useCallback((url: string) => {

    Swal.fire({
      title: "Do you want to remove this picture ?",
      showDenyButton: true,
      confirmButtonText: "remove",
      denyButtonText: `Don't remove`
    }).then((result) => {

      if (result.isConfirmed) {

        setRemovedImages([...removedImages, url])
        setImages(images.filter((imgUrl) => imgUrl != url))

      } else if (result.isDenied) {
        Swal.fire("Picture is not removed", "", "info");
      }
    });

  }, [removedImages])


  const handleSubmit = useCallback(async () => {
    const formData = new FormData();

    newImages.forEach((image) => {
      formData.append('images', image);
    });

    selectedRequirements.forEach((requirementId) => {
      formData.append('typeDocumentsIds', requirementId);
    });

    formData.append("name", name)
    formData.append("description", description)

    removedImages.forEach((removeImage) => {
      formData.append('removedImages', removeImage);
    });

    try {
      const response = await updateDestination(destination?._id, formData)
      if (response.status == 202)
        navigate("/home")
    }
    catch (err) {
      console.log(err)
    }

  }, [name, description, selectedRequirements, newImages, removedImages])

  return (
    <>
      <Navbar />
      <Container className={classes.container}>
        <Stack direction="column">

          <Grid
            container
            spacing={5}
            className={classes.customGrid}
          >
            {images.map((imageUrl, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <img src={`${import.meta.env.VITE_API_BASE_URL}${removePublic(imageUrl)}`}
                  style={{ width: '100%' }} className={classes.image} />
                <IconButton aria-label="delete" className={classes.deleteButton} onClick={() => deletePicture(imageUrl)} >
                  <DeleteForeverIcon sx={{ fontSize: 40 }} />
                </IconButton>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={6} className={classes.gridAdd} >
              <IconButton >
                <input type="file" multiple onChange={handleFileChange} />
                <AddCircleOutlineIcon className={classes.customIconButton} />
              </IconButton>
            </Grid>
          </Grid>
          <Typography variant="h4" className={classes.title}>Name</Typography>
          <TextField id="outlined-basic" label="Outlined" variant="outlined"
            value={name} onChange={(e) => setName(e.currentTarget.value)} style={{ marginBottom: "16px" }}
            className={classes.input} />
          <Typography variant="h4" className={classes.title}>Description</Typography>
          <TextField
            variant="outlined"
            className={classes.input}
            multiline
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            rows={4}
            fullWidth
            placeholder="Enter text here"
          />
          <Container className={classes.customContainer}>
            <Typography variant="h4" className={classes.title}>Requirements</Typography>
            <Grid item xs={6} sm={6} md={6} lg={6} >
              <List dense={false}>
                {requirements && requirements.map(requirement =>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <Checkbox checked={selectedRequirements.includes(requirement._id)} onClick={() => handleDoc(requirement._id)} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={requirement.name}
                      secondary={requirement.extension}
                    />
                  </ListItem>)
                }

              </List>
            </Grid>
          </Container>
          <Button className={classes.button} onClick={handleSubmit}>Save</Button>
        </Stack>
      </Container>
    </>
  )
}
