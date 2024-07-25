import { Box, Container, Typography } from '@mui/material';

import Technologies from './Technologies';

function Home() {
  const sampleTechnologies = {
    "HTML": './home/html.png', 
    "CSS": './home/css.png',
    "Javascript": './home/js.png',
    "React": './home/react.png',
    "Electron": './home/electron.svg',
    "PHP": './home/php.png',
    "Node.js": './home/nodejs.svg',
    "Express JS": './home/expressjs.svg',
    "MySQL": './home/mysql.png',
    "Firebase": './home/firebase.svg',
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
        <Technologies 
          technologies={sampleTechnologies}
          height={'64px'}
          fadeWidth={'100px'}
          sx={{
            mt: '2em',
            width: '92%',
          }}
        />
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