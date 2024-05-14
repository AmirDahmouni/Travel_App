import React, { useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { useRecoilState } from 'recoil';
import { isAuthenticatedState, userDataState } from '../../atoms';
import { signUp } from "../../services/authService";
import PasswordInput from '../../components/PasswordInput';
import Swal from 'sweetalert2';



const SignupPage: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [telephone, setTelephone] = useState('');
  const [type, setType] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
  const [, setUserData] = useRecoilState(userDataState);



  const navigate = useNavigate();

  const handleTypeChange = (e: any) => {
    setType(e.target.value);

  }

  const handleSignup = async () => {
    try {
      if (password !== confirmpassword) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `Invalid confirm password `,
          showConfirmButton: false,
          timer: 2000
        });
      }

      const formData = new FormData();
      formData.append("firstname", firstname)
      formData.append("lastname", lastname)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("telephone", telephone)
      formData.append("type", type)

      if (email == "" || firstname == "" || lastname == "" || password == "" || telephone == "" || type == "") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Empty field(s)",
          showConfirmButton: false,
          timer: 2000
        });
        return
      }

      await signUp(formData);

      Swal.fire({
        position: "center",
        icon: "success",
        title: `Sucess signup Wait for validation ...`,
        showConfirmButton: false,
        timer: 2000
      });

      navigate('/login');

    } catch (error: any) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.Error,
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  return (
    <Container style={{ width: "40%", marginBottom: "32px" }}>
      <Stack direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={5} >
        <Stack direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1} >
          <Typography variant="h1" style={{ color: 'rgb(27, 170, 227)', fontWeight: "bold" }} >
            LEONI
          </Typography>
          <Typography variant="h4" style={{ color: 'rgb(27, 170, 227)', padding: "14px" }} >
            Travel Management
          </Typography>
        </Stack>

        <Grid container spacing={3}>

          <Grid container spacing={3}>
            {/* First Row */}
            <Grid item xs={12}>
              <TextField label="First Name" value={firstname} onChange={(e) => setFirstname(e.currentTarget.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Last Name" value={lastname} onChange={(e) => setLastname(e.currentTarget.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Telephone" value={telephone} onChange={(e) => setTelephone(e.currentTarget.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} fullWidth />
            </Grid>

            {/* Second Row */}
            <Grid item xs={12}>
              <PasswordInput
                password={password}
                label="Password"
                handlePassword={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                label="Reconfirm Password"
                password={confirmpassword}
                handlePassword={(e) => setConfirmpassword(e.target.value)}
              />
            </Grid>

            {/* Third Row */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Position</InputLabel>
                <Select value={type} onChange={handleTypeChange}  >
                  <MenuItem value="ADMIN_TRAV">Admin</MenuItem>
                  <MenuItem value="SOS">Sos</MenuItem>
                  <MenuItem value="TRAVELER">Traveler</MenuItem>
                  <MenuItem value="VISITOR">Visitor</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                style={{ color: 'rgb(40,48,68)', padding: "14px", backgroundColor: 'rgb(254,200,80)' }}
                variant="contained"
                className="button"
                fullWidth
                onClick={handleSignup}
              >
                SignUp
              </Button>
            </Grid>
            {/* Button */}
            <Grid item xs={12}>
              <Button
                style={{ color: 'rgb(254,200,80)', padding: "14px", backgroundColor: 'rgb(40,48,68)' }}
                variant="contained"
                fullWidth
                className="button"
                onClick={() => navigate('/Login')}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Grid>


      </Stack>
    </Container >
  );
}

export default SignupPage;