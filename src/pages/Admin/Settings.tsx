import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import { Container, Grid, Stack, Typography, TextField, Button, MenuItem, Select, List, ListItem, IconButton, ListItemAvatar, ListItemText, Avatar } from '@mui/material'
import { makeStyles } from "@mui/styles";
import PasswordInput from '../../components/PasswordInput';
import iconnUser from "../../assets/icon_user.png";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPendingUsers, updateUser } from '../../services/userService';
import { UserData } from '../../types/User';
import { changeStatus } from '../../services/userService';
import { getAllTypesDocument, removeTypeDocument, newTypeDocument } from '../../services/typeDocService';
import { userDataState } from '../../atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import Swal from 'sweetalert2';

const useStyles = makeStyles(() => ({
  container: {
    width: "80%",
    margin: "164px",
    marginTop: "75px"
  },
  stack: {
    width: "70%",
    margin: "auto",
    placeItems: "baseline !important"
  },
  title: {
    color: "#283044 !important"
  },
  img: {
    backgroundColor: "#283044 !important",
    borderRadius: "20px",
    padding: "5px"
  },
  label: {
    fontSize: "18px",
    fontWeight: "500 !important",
    textAlign: "left"
  },
  input: {
    backgroundColor: "lightgray"
  },
  select: {
    width: "100%",
    backgroundColor: "lightgray"
  },
  addButton: {

    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "24px !important",
    width: "200px",
    fontSize: "14px !important",
    fontWeight: "500 !important",
    borderRadius: "8px !important",
    padding: "8px !important"
  },
  saveButton: {
    alignSelf: "center",
    backgroundColor: "#283044 !important",
    color: "#FEC74F !important",
    marginTop: "24px !important",
    width: "200px",
    fontSize: "14px !important",
    fontWeight: "500 !important",
    borderRadius: "8px !important",
    padding: "8px !important"
  },
  approveBtn: {
    alignSelf: "center",
    backgroundColor: "#0C9B00 !important",
    color: "white !important",
    marginTop: "24px !important",
    width: "80%",
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
    width: "50%",
    fontSize: "14px !important",
    fontWeight: "500 !important",
    borderRadius: "40px !important",
    padding: "8px !important"
  }
}))


export default function SettingsAdmin() {

  const classes = useStyles();

  const userData: UserData | null = useRecoilValue(userDataState);
  const [, setUserData] = useRecoilState<UserData>(userDataState);

  const [pendingUsers, setPendingUsers] = useState<UserData[]>([])
  const [typeDocs, setTypeDocs] = useState<any[]>([])

  const [firstname, setFirstname] = useState<string>(userData.firstname)
  const [lastname, setLastname] = useState<string>(userData.lastname)
  const [email, setEmail] = useState<string>(userData.email)
  const [telephone, setTelephone] = useState<string>(userData.telephone)


  useEffect(() => {
    const fetchData = async () => {
      const pendingUsers = await getPendingUsers()
      const typeDocs = await getAllTypesDocument()
      setPendingUsers(pendingUsers)
      setTypeDocs(typeDocs)
    };

    fetchData();

  }, [])


  const [extensions, setExtensions] = useState<string[]>(["PDF", "DOCX", "PNG", "JPG", "JPEG"]);

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const [nameDoc, setNameDoc] = useState("")
  const [extension, setExtension] = useState<string>("");


  const addDocument = useCallback(async () => {
    const response = await newTypeDocument(nameDoc, extension)

    if (response?.status == 201) {

      setTypeDocs([...typeDocs, response.data.data])
    }
  }, [nameDoc, extension])

  const handleChangeExtension = (e) => {
    setExtension(e.target.value)
  }

  const changeUserStatus = useCallback(async (id: string, status: string) => {


    Swal.fire({
      title: "Do you want to confirm the decision?",
      showDenyButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: `Don't confirm`
    }).then(async (result) => {

      if (result.isConfirmed) {

        const response = await changeStatus(id, status)

        const pendingUsersCopy = [...pendingUsers]
        if (response.status == 200) {
          const index = pendingUsersCopy.findIndex(obj => obj._id === id);
          if (index !== -1) {
            // Remove the object at the found index
            pendingUsersCopy.splice(index, 1);
            setPendingUsers(pendingUsersCopy)
          }
        }

        Swal.fire(`${status} !`, "", "success");

      } else if (result.isDenied) {
        Swal.fire("Decision is not saved", "", "info");
      }
    });


  }, [pendingUsers])

  const removeTypeDoc = useCallback(async (id: string) => {


    Swal.fire({
      title: "Do you want to delete this document ?",
      showDenyButton: true,

      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`
    }).then(async (result) => {

      if (result.isConfirmed) {
        const response = await removeTypeDocument(id)

        const typeDocsCopy = [...typeDocs]

        if (response?.status == 200) {
          const index = typeDocsCopy.findIndex(obj => obj._id === id);
          if (index !== -1) {

            typeDocsCopy.splice(index, 1);
            setTypeDocs(typeDocsCopy)
          }
        }
        Swal.fire("removed successfully!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Document is not delted", "", "info");
      }
    });


  }, [typeDocs])

  const updateProfil = useCallback(async () => {
    if (firstname != "" && lastname != "" && email != "" && telephone != "") {

      const formData = new FormData();
      formData.append("firstname", firstname)
      formData.append("lastname", lastname)
      formData.append("email", email)

      formData.append("telephone", telephone)

      if (oldPassword != "" && newPassword != "" && confirmNewPassword != "" && newPassword == confirmNewPassword) {
        formData.append("oldPassword", oldPassword)
        formData.append("newPassword", newPassword)
      }

      try {
        const response = await updateUser(userData._id, formData)

        Swal.fire({
          position: "center",
          icon: "success",
          title: `Success updating profile Infos`,
          showConfirmButton: false,
          timer: 2000
        });
        setUserData({
          ...userData,
          firstname,
          lastname,
          email,
          telephone
        })
      }
      catch (err: any) {

        Swal.fire({
          position: "center",
          icon: "error",
          title: `Failed to upload profile infos`,
          text: err,
          showConfirmButton: false,
          timer: 2000
        });
      }
    }
    else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Empty field(s)`,
        showConfirmButton: false,
        timer: 2000
      });
    }


  }, [firstname, lastname, email, telephone, oldPassword, newPassword])


  return (
    <>
      <Navbar />
      <Container className={classes.container} >
        <Stack
          className={classes.stack}
          direction="column"
          justifyContent="center"
          spacing={5}
          alignItems="center"
        >
          <Stack direction="row" spacing={2}>
            <img src={iconnUser} className={classes.img} />
            <Typography variant="h4" className={classes.title}>
              {"Hi " + userData?.firstname + " " + userData?.lastname}
            </Typography>
          </Stack>

          <Grid container spacing={2} style={{ padding: "32px", marginTop: "24px" }}>
            <Grid item xs={12} sm={6} md={6} lg={6} >
              <Grid container spacing={2}  >
                <Grid item xs={12} className={classes.label} >
                  Firstname
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth value={firstname} onChange={(e) => setFirstname(e.currentTarget.value)} variant="outlined" className={classes.input} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.label}>
                  Lastname
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth value={lastname} onChange={(e) => setLastname(e.currentTarget.value)} variant="outlined" className={classes.input} />
                </Grid>
              </Grid>
            </Grid>

            {/*****************second row********************************* */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.label}>
                  Email
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth value={email} onChange={(e) => setEmail(e.currentTarget.value)} variant="outlined" className={classes.input} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.label}>
                  Telephone
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth value={telephone} onChange={(e) => setTelephone(e.currentTarget.value)} variant="outlined" className={classes.input} />
                </Grid>
              </Grid>
            </Grid>

            {/*****************Third row********************************* */}
            <Grid item xs={12} sm={6} md={4} lg={4} >
              <Grid container spacing={2}  >
                <Grid item xs={12} className={classes.label} >
                  Old password
                </Grid>
                <Grid item xs={12}>
                  <PasswordInput
                    label="Old password"
                    password={oldPassword}
                    handlePassword={(e) => setOldPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} >
              <Grid container spacing={2}  >
                <Grid item xs={12} className={classes.label} >
                  New password
                </Grid>
                <Grid item xs={12}>
                  <PasswordInput
                    label="New password"
                    password={newPassword}
                    handlePassword={(e) => setNewPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} >
              <Grid container spacing={2}  >
                <Grid item xs={12} className={classes.label} >
                  Confirm new password
                </Grid>
                <Grid item xs={12}>
                  <PasswordInput
                    label="Confirm new password"
                    password={confirmNewPassword}
                    handlePassword={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" className={classes.saveButton} onClick={updateProfil}>
            Save
          </Button>


          <Grid container spacing={2} style={{ padding: "32px", marginTop: "0px", textAlign: "left" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} >
              <Typography variant="h4" className={classes.title}>Documents</Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} >
              <List dense={false}>
                {typeDocs && typeDocs.map(doc =>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => removeTypeDoc(doc._id)}>
                        <DeleteIcon />
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


            <Grid item xs={12} sm={4} md={4} lg={4} >
              <Grid container spacing={2} >
                <Grid item xs={12} className={classes.label} >
                  Name
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth onChange={(e) => setNameDoc(e.currentTarget.value)} value={nameDoc} variant="outlined" className={classes.input} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} >
              <Grid container spacing={2} >
                <Grid item xs={12} className={classes.label} >
                  Extension
                </Grid>
                <Grid item xs={12}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={extension}
                    label="Extesion"
                    onChange={handleChangeExtension}
                    className={classes.select}
                  >
                    {extensions.map(extension => <MenuItem value={extension}>{extension}</MenuItem>)}
                  </Select>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4} style={{ paddingTop: "42px" }} >
              <Button variant="contained" className={classes.addButton} onClick={addDocument}>
                <AddCircleIcon />
              </Button>
            </Grid>



            <Grid item xs={12} sm={12} md={12} lg={12} >
              <Typography variant="h4" className={classes.title}>New Users</Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} >
              <List dense={false}>
                {
                  pendingUsers.map(user =>
                    <ListItem
                      secondaryAction={
                        <Stack direction="row" spacing={3} >
                          <Button className={classes.approveBtn} onClick={() => changeUserStatus(user._id, "accepted")}>Accept</Button>
                          <Button className={classes.denyBtn} onClick={() => changeUserStatus(user._id, "refused")}>Deny</Button>
                        </Stack>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${user.firstname} ${user.lastname}`}
                        secondary={`${user.type}`}
                      />
                    </ListItem>
                  )
                }

              </List>
            </Grid>
          </Grid>

        </Stack>
      </Container>
    </>
  )
}
