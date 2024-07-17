import { useState, useEffect } from 'react';
import { Box, Typography, Link, Button, IconButton } from "@mui/material"
import { Link as LinkIcon, ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';

function ProjectContainer(props) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const projectPictureContainerElement = document.getElementById(props.projectId + '-project-picture-container')
    let lastProjectPictureElement = projectPictureContainerElement.children[0]
    let counter = 0
    let intervalId = null

    async function startImageChangeInterval() {
      // delay
      await new Promise((resolve) => setTimeout(resolve, props.index * 200));
  
      intervalId = setInterval(() => {
        counter += 1
        if (counter == props.project.pictures.length) {
          counter = 0
        }
  
        const projectPictureElement = projectPictureContainerElement.children[counter]
  
        // projectPictureContainerElement.style.opacity = 0;
        // projectPictureContainerElement.style.marginTop = '-10px';
        // setTimeout(() => {
          // projectPictureContainerElement.style.marginTop = '0';
          // projectPictureContainerElement.style.opacity = 1;
          lastProjectPictureElement.style.display = 'none'
          projectPictureElement.style.display = 'block'
  
          lastProjectPictureElement = projectPictureElement
        // }, 200)
      }, 7000)
    }
    startImageChangeInterval()

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const boxStyles = {
    display: 'flex',
    mb: '2em',
    mr: '2em',
    width: 'calc(50% - 2em)',
    position: 'relative',
    transition: 'all .5s ease',
    opacity: 0,
    cursor: isHovered ? 'default' : 'pointer'
  }

  if (props.isRightColumn) {
    boxStyles.mt = {
      xl: '2em',
      lg: '0'
    }
  }

  const gradientBoxStyles = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    transition: 'all .5s ease',
    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
  }

  const frontBoxStyles = {
    display: 'flex',
    width: '100%',
    transition: 'all .5s ease',
    borderRadius: '24px 0 0 24px',
    opacity: 1,
    ':hover': {
      backgroundColor: '#ffc107'
    }
  }

  const backBoxStyles = {
    position: 'absolute',
    zIndex: 0,
    width: '320px',
    height: '100%',
    transition: 'all .5s ease',
    opacity: 0,
    borderRadius: 5,
  }

  if (isHovered) {
    frontBoxStyles.opacity = 0
    backBoxStyles.opacity = 1
    backBoxStyles.zIndex = 2
    backBoxStyles.width = '100%'
  }

  let renderedImages = []

  props.project.pictures.forEach((imageUrl, index) => {
    renderedImages.push(
      <img 
        onLoad={index == 0 ? () => props.handleOnLoad(props.loadingFirstImage - 1) : () => {}}
        id={props.projectId + '-project-picture-' + index} 
        key={index}
        src={imageUrl} 
        width={'320px'}
        height={'200px'}
        style={{
          // transition: 'opacity .2s ease',
          zIndex: 1,
          opacity: 1,
          display: index == 0 ? 'block' : 'none',
          objectFit: 'cover'
      }} />
    )
  })

  return (
    <Box
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      onClick={!isHovered ? () => setIsHovered(true) : null}
      height={'200px'}
      sx={boxStyles}>
      <Box
        height={'200px'}
        sx={frontBoxStyles}>
        <Box
          sx={gradientBoxStyles} />
        <Box
          id={props.projectId + '-project-picture-container'}
          sx={{
            borderRadius: 5,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '320px',
            height: '200px',
            transition: 'all .5s ease',
            zIndex: 1,
          }}>
          {renderedImages}
        </Box>
        <Box sx={{
          my: '.5em',
          ml: '1em',
          width: 'calc(100% - 320px - 1em)',
          zIndex: 1,
          mr: '1em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography variant="h3">{props.project.name}</Typography>
            <Typography
              sx={{
                mt: '.10em'
              }}>{props.project.description}</Typography>
          </Box>
          <Typography>{'> ' + props.project.technologies}</Typography>
        </Box>
      </Box>
      <Box sx={backBoxStyles}>
        <Box
          height={'calc(200px - 2em)'}
          sx={{
            p: '1em 0 1em 1em',
            borderRadius: 5,
            mb: '1em',
            backgroundColor: 'rgba(255, 193, 7, .7)',
            overflow: 'hidden',
          }}>
          <Box sx={{
            height: 'calc(200px - 2em)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexGrow: 1
          }}>
            <Typography sx={{
              mr: '1em'
            }}>{props.project.details}</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: '-.75em'
              }}>
              {!props.project.link ? <Box/> :
                <Link
                  href={props.project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{
                    display: 'flex',
                    width: '6em'
                  }}>
                  <LinkIcon sx={{
                    mr: '.125em'
                  }}/>  
                  <Typography>{props.project.link.text}</Typography>
                </Link>
              }
              <IconButton
                size='large'
                onClick={() => setIsHovered(false)}
                sx={{
                  color: 'black',
                  '&:hover': { backgroundColor: 'transparent' }
                }}>
                <ArrowBackIosIcon/>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProjectContainer