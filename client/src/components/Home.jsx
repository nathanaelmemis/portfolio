import { Box, Container, Typography } from '@mui/material';

import Technologies from './Technologies';

function Home({ technologies }) {
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
				{!technologies ? '' :
					<Technologies
						technologiesDocs={technologies.docs}
						height={'64px'}
						fadeWidth={'100px'}
						sx={{
							mt: '2em',
							width: '92%',
						}} />
				}
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
					<img
						src='./home/nathan.png'
						width={'350px'}/>
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