import { Container } from "@mui/material"

import ProjectContainer from "./ProjectContainer"
import { useEffect, useState } from "react"
import ZoomedImagePreview from "./ZoomedImagePreview"

function Projects({ projectsData, loadingFirstImage, setLoadingFirstIamge }) {
	const [renderedProjects, setRenderedProjects] = useState([])
	const [projectZoomedImagesPreview, setProjectZoomedImagesPreview] = useState([])

	const handleOnLoad = (value) => {
		setLoadingFirstIamge(value)
	}

	// Render projects
	useEffect(() => {
		let counter = 0
		let renderedProjectsTemp = []

		if (projectsData) {
			projectsData.forEach((doc) => {
				renderedProjectsTemp.push(
					<ProjectContainer
						key={doc.id}
						projectId={doc.id}
						project={doc.data()}
						index={counter}
						loadingFirstImage={loadingFirstImage}
						handleOnLoad={handleOnLoad}
						isRightColumn={counter % 2 == 0 ? false : true} 
						setProjectZoomedImagesPreview={setProjectZoomedImagesPreview}/>
				)
				counter += 1
			})

			setRenderedProjects(renderedProjectsTemp)
		}
	}, [projectsData, loadingFirstImage])

	return (
		<>
			<Container
				maxWidth='xl'
				sx={{
					mt: '2em',
					display: 'flex',
					flexWrap: 'wrap'
				}}>
				{renderedProjects}
			</Container>
			<ZoomedImagePreview 
				images={projectZoomedImagesPreview}
                handleOnClose={() => setProjectZoomedImagesPreview([])}
			/>
		</>
	)
}

export default Projects