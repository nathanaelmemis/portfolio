import { useState } from 'react';

import { Box, Container, Typography, Button } from '@mui/material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';

import Technologies from './Technologies';

function Home({ technologies }) {
	const [isImageHovered, setIsImageHovered] = useState(false);
	return (
		<Container sx={{
			height: 'calc(100vh - 112px)',
			display: 'flex'
		}}>

			{/* Left Column */}
			<Box sx={{
				pt: '10em',
				width: '65%'
			}}>
				<Typography variant='h5'>Hi I'm</Typography>
				<Typography 
					variant='h2'
					sx={{
						animation: 'colorChange 10s infinite',
						'@keyframes colorChange': {
							'40%': {
								color: 'black',
							},
							'50%': {
								color: '#ffc107',
							},
							'70%': {
								color: 'black',
							},
						}
					}}>Nathanael Memis</Typography>
				<Typography>I am a programming enthusiast that loves to create projects I'm interested in.</Typography>
				<Typography>I graduated from the Polytechnic University of the Philippines as a Bachelor in Computer Science.</Typography>
				<Typography>I specialize in Software Development, Web Development, and Machine Learning.</Typography>
				{!technologies ? 
					<Box height={'calc(64px + 2em)'}></Box>:
					<Technologies
						technologiesDocs={technologies.docs}
						height={'64px'}
						fadeWidth={'100px'}
						sx={{
							mt: '2em',
							width: '92%',
						}} />
				}
				<Button 
					variant='contained' 
					color='secondary'
					startIcon={<OpenInNewIcon />}
					href='https://drive.google.com/file/d/1iqaPmTCRiSrtm7q9Bugz7bU2aR7krSJI/view'
					target='_blank'
					sx={{
						borderRadius: 5,
						mt: '2em',
						textTransform: 'none',
						
					}}>Resume</Button>
			</Box>

			{/* Right Column */}
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
					<img
						src='./home/background.png'
						width={'350px'}/>
					<img 
						onMouseOver={() => setIsImageHovered(true)}
						onMouseOut={() => setIsImageHovered(false)}
						src='./home/nathan.png'
						width={'350px'}
						style={{
							position: 'absolute',
							left: 0,
							top: 0,
							transition: 'transform 1.5s ease',
							transform: isImageHovered ? 'scale(1.05) translateX(-7.5px) translateY(-2px)' : 'scale(1) translateX(-7.5px) translateY(0)',
						}}/>
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