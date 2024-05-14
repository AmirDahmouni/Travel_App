import React, { useCallback, useEffect, useState } from 'react'
import { Stack, Grid, Container, IconButton, Typography, TextField, Checkbox, Button, ListItem, List, ListItemAvatar, ListItemText, Avatar } from '@mui/material'
import { makeStyles } from "@mui/styles";
import Navbar from '../../components/Navbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderIcon from '@mui/icons-material/Folder';
import { getAllTypesDocument } from '../../services/typeDocService';
import { newDestination } from '../../services/destinationService';
import { useNavigate } from 'react-router-dom';
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
  }


}));

export default function NewDestination() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [typeDocs, setTypeDocs] = useState<any[]>([])

  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [requirements, setRequirements] = useState<string[]>([])


  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const handleFileChange = (event: any) => {
    setSelectedImages(Array.from(event.target.files));
  };


  useEffect(() => {
    const fetchData = async () => {
      const typeDocs = await getAllTypesDocument()
      setTypeDocs(typeDocs)
    };

    fetchData();

  }, [])

  const handleDoc = useCallback((id: string) => {
    if (requirements.includes(id)) {
      setRequirements(requirements.filter((reqId) => reqId != id))
    } else {
      setRequirements([...requirements, id])
    }
  }, [requirements])

  const handleSubmit = useCallback(async () => {

    Swal.fire({
      title: "Do you want to create the new destination?",
      showDenyButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: `Don't confirm`
    }).then(async (result) => {

      if (result.isConfirmed) {
        const formData = new FormData();
        selectedImages.forEach((image) => {
          formData.append('images', image);
        });
        requirements.forEach((requirementId) => {
          formData.append('typeDocumentsIds', requirementId);
        });
        formData.append("name", name)
        formData.append("directory", name)
        formData.append("description", description)
        try {
          const response = await newDestination(formData)
          if (response.status == 201) {
            Swal.fire(`Created !`, "", "success");
            navigate("/home")
          }
        }
        catch (err) {
          Swal.fire("Error creating new destination", "", "error");
        }

      } else if (result.isDenied) {
        Swal.fire("Destination is not created", "", "info");
      }
    });

  }, [name, description, requirements])


  return (
    <>
      <Navbar />
      <Container className={classes.container}>
        <Stack direction="column">
          <Typography variant="h3" className={classes.title}>New Destination</Typography>
          <Grid
            container
            spacing={5}
            className={classes.customGrid}
          >

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
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            className={classes.input}
            placeholder="Enter text here"
          />
          <Container className={classes.customContainer}>
            <Typography variant="h4" className={classes.title}>Requirements</Typography>
            <Grid item xs={6} sm={6} md={6} lg={6} >
              <List dense={false}>
                {typeDocs && typeDocs.map(doc =>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <Checkbox onClick={() => handleDoc(doc._id)} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={doc.name}
                      secondary={doc.extension}
                    />
                  </ListItem>)
                }

              </List>
            </Grid>
          </Container>
          <Button className={classes.button} onClick={handleSubmit}>Create</Button>
        </Stack>
      </Container>
    </>
  )
}
