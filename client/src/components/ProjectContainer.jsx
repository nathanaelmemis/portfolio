import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Link, IconButton } from "@mui/material"
import { Link as LinkIcon, ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';

function ProjectContainer({ projectId, project, index, loadingFirstImage, handleOnLoad, isRightColumn, setProjectZoomedImagesPreview }) {
	const [isDetailOpened, setIsDetailOpened] = useState(false);
	const [renderedImages, setRenderedImages] = useState([])
	const [isImageMouseOver, setIsImageMouseOver] = useState(false)
	const mouseOverTimeoutIdRef = useRef(null)

	// Image change interval
	useEffect(() => {
		const projectPictureContainerElement = document.getElementById(projectId + '-project-picture-container')

        // no need to do intervals on a single image
        if (projectPictureContainerElement.children.length <= 1) {
            return
        }

		let lastProjectPictureElement = projectPictureContainerElement.children[0]
		let counter = 0
		let intervalId = null

		async function startImageChangeInterval() {
			// delay
			await new Promise((resolve) => setTimeout(resolve, index * 200));

			intervalId = setInterval(() => {
				counter += 1
				if (counter == project.pictures.length) {
					counter = 0
				}

				const projectPictureElement = projectPictureContainerElement.children[counter]

				lastProjectPictureElement.style.display = 'none'
				projectPictureElement.style.display = 'block'

				lastProjectPictureElement = projectPictureElement
			}, 7000)
		}
		startImageChangeInterval()

		return () => {
			clearInterval(intervalId)
		}
	}, [renderedImages])

	const boxStyles = {
		display: 'flex',
		mb: '2em',
		mr: '2em',
		width: 'calc(50% - 2em)',
		position: 'relative',
		transition: 'all .5s ease',
		opacity: 1,
		cursor: isDetailOpened ? 'default' : 'pointer'
	}

	if (isRightColumn) {
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
		position: 'relative',
		display: 'flex',
		width: '100%',
		transition: 'all .5s ease',
		borderRadius: '24px 0 0 24px',
		opacity: 1,
		pointerEvents: isDetailOpened ? 'none' : 'auto',
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

	if (isDetailOpened) {
		frontBoxStyles.opacity = 0
		backBoxStyles.opacity = 1
		backBoxStyles.zIndex = 2
		backBoxStyles.width = '100%'
	}

	// Render images
	useEffect(() => {
		let renderedImagesTemp = []

		project.pictures.forEach((imageUrl, index) => {
			renderedImagesTemp.push(
				<img
					onLoad={index == 0 ? () => handleOnLoad(loadingFirstImage - 1) : () => { }}
					id={`${projectId}-project-picture-${index}`}
                    className='responsive-image'
					key={index}
					src={imageUrl}
					width={'320px'}
					height={'200px'}
					style={{
						zIndex: 1,
						opacity: 1,
						display: index == 0 ? 'block' : 'none',
						objectFit: 'cover'
					}} />
			)
		})

		setRenderedImages(renderedImagesTemp)
	}, [project.pictures])

    // Set image object-fit
    useEffect(() => {
        const imageElements = document.querySelectorAll('.responsive-image');

        if (!imageElements.length) {
            return
        }

        imageElements.forEach((imageElement) => {
            const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight

            if (aspectRatio > 1) {
                // Landscape
                imageElement.style.objectFit = 'cover';
            } else {
                // Portrait
                imageElement.style.objectFit = 'scale-down';
            }
        })
    }, [renderedImages])

	function handleImageMouseOver() {
		setIsImageMouseOver(true)
		mouseOverTimeoutIdRef.current = setTimeout(() => {
			setProjectZoomedImagesPreview(project.pictures)
		}, 1200)
	}

	function handleImageMouseLeave() {
		setIsImageMouseOver(false)
		clearTimeout(mouseOverTimeoutIdRef.current)
	}

	return (
		<Box
			onClick={!isDetailOpened ? () => setIsDetailOpened(true) : null}
			height={'200px'}
			sx={boxStyles}>

			{/* Front box */}
			<Box
				height={'200px'}
				sx={frontBoxStyles}>

				{/* Gradient box */}
				<Box
					sx={gradientBoxStyles} />

				{/* Image container */}
				<Box
					id={projectId + '-project-picture-container'}
					onMouseEnter={handleImageMouseOver}
					onMouseLeave={handleImageMouseLeave}
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
                        backgroundColor: 'rgba(0, 0, 0, .3)'
					}}>
					{renderedImages}
				</Box>

				{/* Text container */}
				<Box sx={{
					my: '.5em',
					ml: '1em',
					width: 'calc(100% - 320px - 2em)',
					zIndex: 1,
					mr: '1em',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between'
				}}>
					<Box>
						<Typography variant="h3">{project.name}</Typography>
						<Typography
							sx={{
								mt: '.10em'
							}}>{project.description}</Typography>
					</Box>
					<Typography>{'> ' + project.technologies}</Typography>
				</Box>

				{/* Image hover interaction container */}
				<Box
					sx={{
						opacity: isImageMouseOver ? 1 : 0,
						position: 'absolute',
						top: 0,
						left: 0,
						width: '320px',
						height: '100%',
						zIndex: 2,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						transition: 'opacity 1s ease',
						pointerEvents: 'none',
						background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 70%)',
						borderRadius: 5
					}}>
					<Typography
						sx={{
							margin: '0',
							width: '100%',
							textAlign: 'center',
						}}>Hover to zoom</Typography>
				</Box>
			</Box>

			{/* Back box */}
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
						}}>{project.details}</Typography>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: '-.75em'
							}}>
							{!project.link.href ? <Box /> :
								<Link
									href={project.link.href}
									target="_blank"
									rel="noopener noreferrer"
									underline="none"
									sx={{
										display: 'flex',
										width: '6em'
									}}>
									<LinkIcon sx={{
										mr: '.125em'
									}} />
									<Typography>{project.link.text}</Typography>
								</Link>
							}
							<IconButton
								size='large'
								onClick={() => setIsDetailOpened(false)}
								sx={{
									color: 'black',
									'&:hover': { backgroundColor: 'transparent' }
								}}>
								<ArrowBackIosIcon />
							</IconButton>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

export default ProjectContainer