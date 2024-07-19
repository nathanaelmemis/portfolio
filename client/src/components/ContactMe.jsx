import { Container, Box, Typography, Link } from "@mui/material"
import { Facebook, Instagram, GitHub, LinkedIn, Email, Phone } from '@mui/icons-material';

function ContactMe() {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        height: 'calc(100vh - 112px)',
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mr: '10em'
        }}>
        <Typography 
          variant="h3"
          sx={{
            mt: '2em',
            mb: '.5em'
          }}>
          Links
        </Typography>
        <Link
          href={'https://www.facebook.com/nathanaelstephen.memis'}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{display: 'flex', width: '5em', mb: '.5em'}}>
          <Facebook sx={{mr: '.125em'}}/>  
          <Typography>Facebook</Typography>
        </Link>
        <Link
          href={'https://www.instagram.com/stephen_m3owking'}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{color: '#c32aa3', display: 'flex', width: '5em', mb: '.5em'}}>
          <Instagram sx={{mr: '.125em'}}/>  
          <Typography>Instagram</Typography>
        </Link>
        <Link
          href={'https://github.com/nathanaelmemis'}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{color: '#2b3137', display: 'flex', width: '5em', mb: '.5em'}}>
          <GitHub sx={{mr: '.125em'}}/>  
          <Typography>GitHub</Typography>
        </Link>
        <Link
          href={'https://www.linkedin.com/in/nathanael-stephen-memis-52a776270'}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{color: '#0a66c2', display: 'flex', width: '5em', mb: '.5em'}}>
          <LinkedIn sx={{mr: '.125em'}}/>  
          <Typography>LinkedIn</Typography>
        </Link>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Typography 
          variant="h3"
          sx={{
            mt: '2em',
            mb: '.5em'
          }}>
          Contacts
        </Typography>
        <Typography
          sx={{
            display: 'flex',
            mb: '.5em'
          }}>
          <Email sx={{
            mr: '.125em'
          }}/>nathanaelmemis@gmail.com
        </Typography>
        <Typography
          sx={{
            display: 'flex'
          }}>
          <Phone sx={{
            mr: '.125em'
          }}/>09194701004
        </Typography>
      </Box>
    </Container>
  )
}

export default ContactMe