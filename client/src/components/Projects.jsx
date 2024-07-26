import { Container } from "@mui/material"

import ProjectContainer from "./ProjectContainer"
import { useEffect, useState } from "react"

function Projects({ projectsData, loadingFirstImage, setLoadingFirstIamge }) {
  const [renderedProjects, setRenderedProjects] = useState([])

  const handleOnLoad = (value) => {
    setLoadingFirstIamge(value)
  }

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
            isRightColumn={counter % 2 == 0 ? false : true}/>
        )
        counter += 1
      })
  
      setRenderedProjects(renderedProjectsTemp)
    }
  }, [projectsData, loadingFirstImage])

  return (
    <Container
      maxWidth='xl'
      sx={{
        mt: '2em',
        display: 'flex',
        flexWrap: 'wrap'
      }}>
      {renderedProjects}
    </Container>
  )
}

export default Projects