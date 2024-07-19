import { Box, Container, Typography } from '@mui/material';
import './home.scss'

import Technologies from './Technologies';

function Home() {
  function handleTechnologiesMouseOver() {
    const technologiesAElement = document.getElementById('technologiesA');
    const technologiesBElement = document.getElementById('technologiesB');
    technologiesAElement.style.animationPlayState = 'paused';
    technologiesBElement.style.animationPlayState = 'paused';
  }

  function handleTechnologiesMouseOut() {
    const technologiesAElement = document.getElementById('technologiesA');
    const technologiesBElement = document.getElementById('technologiesB');
    technologiesAElement.style.animationPlayState = 'running';
    technologiesBElement.style.animationPlayState = 'running';
  }

  return (
    <Container sx={{
      height: 'calc(100vh - 112px)',
      display: 'flex'
    }}>
      <Box sx={{
        pt: '10em',
        width: '65%'
      }}>
        <Typography variant='h5'>Hi I'm</Typography>
        <Typography variant='h2'>Nathanael Memis</Typography>
        <Typography>I am a programming enthusiast that loves to create projects I'm interested in.</Typography>
        <Typography>I graduated from the Polytechnic University of the Philippines as a Bachelor in Computer Science.</Typography>
        <Typography>I specialize in Software Development, Web Development, and Machine Learning.</Typography>
        <Box
          onMouseOver={handleTechnologiesMouseOver}
          onMouseOut={handleTechnologiesMouseOut}
          sx={{
            pt: '1em',
            width: '80%',
            height: '90px',
            overflow: 'hidden',
            position: 'relative',
          }}>
          <Box sx={{
            width: '15%',
            height: '100%',
            backgroundImage: 'linear-gradient(to left, rgba(255, 255, 255,0), rgba(255, 255, 255,1))',
            position: 'absolute',
            zIndex: '1'
          }} />
          <Box sx={{
            width: '15%',
            height: '100%',
            marginLeft: '85%',
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255,0), rgba(255, 255, 255,1))',
            position: 'absolute',
            zIndex: '1'
          }} />
          <Technologies elementId='technologiesA' styles={{
            position: 'absolute',
            width: '68em',
            '& img': {
              mr: '2em'
            },
            left: '0px',
            display: 'flex',
            alignItems: 'center',
            animation: 'scroll-left-1 20s linear infinite',
            '@keyframes scroll-left-1': {
              '0%': {
                left: '0px'
              },
              '49%': {
                top: '1em'
              },
              '50%': {
                left: '-1088px',
                top: '100px'
              },
              '51%': {
                left: '1088px',
                top: '100px'
              },
              '52%': {
                top: '1em'
              },
              '100%': {
                left: '0px'
              }
            }
          }} />
          <Technologies elementId='technologiesB' styles={{
            position: 'absolute',
            width: '68em',
            '& img': {
              mr: '2em'
            },
            display: 'flex',
            alignItems: 'center',
            left: '1088px',
            animation: 'scroll-left-2 20s linear infinite',
            '@keyframes scroll-left-2': {
              '0%': {
                left: '1088px',
                top: '100px'
              },
              '1%': {
                top: '1em'
              },
              '99%': {
                top: '1em'
              },
              '100%': {
                left: '-1088px',
                top: '100px'
              },
            }
          }} />
        </Box>
      </Box>
      <Box 
        sx={{
          width: '35%',
      }}>
        <Box sx={{
          width: '400px',
          height: '500px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <Box sx={{
            width: '15%',
            height: '100%',
            backgroundImage: 'linear-gradient(to left, rgba(255, 255, 255,0), rgba(255, 255, 255,1))',
            position: 'absolute',
          }} />
          <img src='./home/nathan.png' width={'350px'} />
        </Box>
        <Box sx={{
            width: '110%',
            height: '2px',
            backgroundColor: '#ffc107',
            bottom: '5em',
            borderRadius: 5
          }} >
          <Box sx={{
            width: '50%',
            height: '100%',
            backgroundImage: 'linear-gradient(to left, rgba(255, 255, 255,0), rgba(255, 255, 255,1))',
          }} />
        </Box>
      </Box>
    </Container>
  );
}

export default Home