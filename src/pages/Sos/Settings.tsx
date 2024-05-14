import React, { useCallback, useState } from 'react'
import Navbar from '../../components/Navbar';
import { Container, Grid, Stack, Typography, TextField, Button } from '@mui/material'
import { makeStyles } from "@mui/styles";
import iconnUser from "../../assets/icon_user.png"
import PasswordInput from '../../components/PasswordInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userDataState } from '../../atoms';
import { updateUser } from '../../services/userService';
import Swal from 'sweetalert2';
import { UserData } from '../../types/User';


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
  request: {
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
  }
}))

export default function SettingsSos() {

  const classes = useStyles();
  const userData: UserData | null = useRecoilValue(userDataState);
  const [, setUserData] = useRecoilState<UserData>(userDataState);

  const [firstname, setFirstname] = useState<string>(userData.firstname)
  const [lastname, setLastname] = useState<string>(userData.lastname)
  const [email, setEmail] = useState<string>(userData.email)
  const [telephone, setTelephone] = useState<string>(userData.telephone)


  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")


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


  }, [firstname, lastname, email, telephone, oldPassword, newPassword, confirmNewPassword])


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
              {"Hi " + userData?.firstname + " " + userData?.lastname + "!"}
            </Typography>
          </Stack>

          <Grid container spacing={2} style={{ padding: "32px", marginTop: "24px" }}>
            <Grid item xs={12} sm={6} md={6} lg={6} >
              <Grid container spacing={2}  >
                <Grid item xs={12} className={classes.label} >
                  Firstname
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth variant="outlined" value={firstname} onChange={(e) => setFirstname(e.currentTarget.value)} className={classes.input} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.label}>
                  Lastname
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth variant="outlined" value={lastname} onChange={(e) => setLastname(e.currentTarget.value)} className={classes.input} />
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
          <Button variant="contained" color="primary" className={classes.saveButton}
            onClick={updateProfil}
          >
            Update profil
          </Button>

        </Stack>
      </Container>
    </>
  )
}
