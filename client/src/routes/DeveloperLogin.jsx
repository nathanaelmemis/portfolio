import { LoadingButton } from '@mui/lab';
import { Button, Container, TextField, Box, Typography, Alert, Fade } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import CryptoJS from "crypto-js"

function Developer() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFailedLogin, setIsFailedLogin] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isErrorMessageShown, setIsErrorMessageShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();

  function hash(text) {
    return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex)
  }

  async function handleLogin() {
    setIsLoading(true)

    try {
      const res = await axios.post('/api/login', {
        email: email,
        hash: hash(email+password)
      })

      localStorage.setItem('developerToken', res.data.data.clientToken)
      navigate('/developer/dashboard')
    } catch (err) {
      console.log(err)
      setEmail('')
      setPassword('')
      setIsFailedLogin(true)
      setErrorMessage(err.response.data.message ? err.response.data.message : err.code)
      setIsErrorMessageShown(true)
    }

    setIsLoading(false)
  }

  function handleKeyDown(e) {
    if (e.key == 'Enter') {
      handleLogin()
    }
  }

  function handlOnChangeEmail(e) {
    setEmail(e.target.value)
    if (isFailedLogin) {
      setIsFailedLogin(false)
      setIsErrorMessageShown(false)
    }
  }

  function handlOnChangePassword(e) {
    setPassword(e.target.value)
    if (isFailedLogin) {
      setIsFailedLogin(false)
      setIsErrorMessageShown(false)
    }
  }

  const handleFailedLoginMessageClose = () => {
    setIsErrorMessageShown(false)
  };

  useEffect(() => {
    if (localStorage.getItem('developerToken')) {
      navigate('/developer/dashboard')
    }
  }, [])

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
      <Typography variant="h3">Developer Login</Typography>
      <Typography color='red' sx={{mb: '2em'}}>this section is only intended for the developer</Typography>
      <TextField 
        value={email}
        onChange={handlOnChangeEmail}
        label='Email'
        color="secondary"
        error={isFailedLogin}
        sx={{
          width: '15em',
          mb: '1em'
        }}/>
      <TextField 
        value={password}
        onChange={handlOnChangePassword}
        label='Password'
        color="secondary"
        type="password"
        onKeyDown={handleKeyDown}
        error={isFailedLogin}
        sx={{
          width: '15em',
          mb: '1em'
        }}/>
      <Box
        sx={{
          textAlign: 'right',
          width: '15em'
        }}>
        <LoadingButton 
          loading={isLoading}
          onClick={handleLogin}
          variant="contained"
          color="secondary">Send</LoadingButton>
      </Box>
      <Fade in={isErrorMessageShown}>
        <Alert
          open
          onClose={handleFailedLoginMessageClose}
          variant='filled'
          severity="error"
          sx={{ position: 'fixed', top: '10px' }}
        >
          {errorMessage}
        </Alert>
      </Fade>
    </Container>
  )
}

export default Developer