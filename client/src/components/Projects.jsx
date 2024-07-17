import { database as db } from "../firebase";
import { collection, getDocs } from "firebase/firestore"; 

import { Box, Container, Modal, Typography } from "@mui/material"

import ProjectContainer from "./ProjectContainer"
import { useEffect, useState } from "react"

import { applyFadeAnimationToChildrenOfParents } from '../utils/animation'

function Projects() {
  const [projectsData, setProjectsData] = useState(null)
  const [renderedProjects, setRenderedProjects] = useState([])
  const [loadingFirstImage, setLoadingFirstIamge] = useState(-1)

  const handleOnLoad = (value) => {
    console.log(value)

    if (value == 0) {
      applyFadeAnimationToChildrenOfParents()
    } else {
      setLoadingFirstIamge(value)
    }
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

  useEffect(() => {
    async function getProjectsData() {
      const querySnapshot = await getDocs(collection(db, "projects"))
      setLoadingFirstIamge(querySnapshot.size)
      setProjectsData(querySnapshot)
    }
    getProjectsData()
  }, [])

  return (
    <Container
      id={'applyFadeAnimationToChildren'}
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