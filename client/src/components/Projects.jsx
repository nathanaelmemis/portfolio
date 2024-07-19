import { database as db } from "../firebase";
import { collection, getDocs } from "firebase/firestore"; 

import { Container } from "@mui/material"

import ProjectContainer from "./ProjectContainer"
import { useEffect, useState } from "react"

function Projects(props) {
  const [renderedProjects, setRenderedProjects] = useState([])
  const [loadingFirstImage, setLoadingFirstIamge] = useState(-1)

  const handleOnLoad = (value) => {
    setLoadingFirstIamge(value)
  }

  useEffect(() => {
    let counter = 0
    let renderedProjectsTemp = []

    if (props.projectsData) {
      props.projectsData.forEach((doc) => {
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
  }, [props.projectsData, loadingFirstImage])

  useEffect(() => {
    async function getProjectsData() {
      const querySnapshot = await getDocs(collection(db, "projects"))
      setLoadingFirstIamge(querySnapshot.size)
      props.setProjectsData(querySnapshot)
    }
    if (!props.projectsData) {
      getProjectsData()
    }
  }, [])

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