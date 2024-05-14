import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { useRecoilState } from 'recoil';
import { isAuthenticatedState, userDataState } from '../../atoms';
import { login } from "../../services/authService";
import PasswordInput from '../../components/PasswordInput';
import Swal from 'sweetalert2';



const LoginPage: React.FC = () => {
  const inputProps = {
    style: { borderColor: 'rgb(23, 200, 227)' },
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
  const [, setUserData] = useRecoilState(userDataState);

  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const userData = await login(email, password);
      setIsAuthenticated(true);
      setUserData({ ...userData.data, token: userData.token });
      localStorage.setItem('Token', userData.token);
      navigate('/Home');

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"

      });
    }
  };

  return (
    <Container style={{ width: "33%" }}>
      <Stack direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={15} >
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

        <Stack spacing={2} width="90%">
          <TextField
            fullWidth
            size="medium"
            value={email} onChange={(e) => setEmail(e.target.value)}
            label="E-mail"
            variant="outlined" inputProps={inputProps}
          />
          <PasswordInput
            label="Password"
            password={password}
            handlePassword={(e) => setPassword(e.target.value)}
          />
          <Button
            style={{ color: 'rgb(254,200,80)', padding: "14px", backgroundColor: 'rgb(40,48,68)' }}
            variant="contained"
            className="button"
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            style={{ color: 'rgb(40,48,68)', padding: "14px", backgroundColor: 'rgb(254,200,80)' }}
            variant="contained"
            className="button"
            onClick={() => navigate('/Signup')}
          >
            SignUp
          </Button>
        </Stack>
      </Stack>
    </Container >
  );
}

export default LoginPage;