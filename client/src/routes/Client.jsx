import { database as db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore"; 

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';

import Home from '../components/Home';
import Projects from '../components/Projects';
import ContactMe from '../components/ContactMe';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index && index === 1}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {(
        <Box 
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            opacity: value === index ? 1 : 0
          }}>
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Client() {
  const [value, setValue] = useState(0);
  const [projectsData, setProjectsData] = useState(null)
  const [loadingFirstImage, setLoadingFirstIamge] = useState(-1)
  const [technologies, setTechnologies] = useState(null)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function getProjectsAndTechnologiesData() {
      const projectsQuerySnapshot = await getDocs(query(collection(db, "projects"), orderBy('projectNumber')))
      setLoadingFirstIamge(projectsQuerySnapshot.size)
      setProjectsData(projectsQuerySnapshot)


      const technologiesQuerySnapshot = await getDocs(query(collection(db, "technologies"), orderBy("technologyNumber")))
      setTechnologies(technologiesQuerySnapshot)
    }
    if (!projectsData) {
      getProjectsAndTechnologiesData()
    }
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'right' }}>
        <Tabs 
          indicatorColor='secondary'
          value={value} 
          onChange={handleChange} 
          sx={{ 
            mt: '4em',
            mr: '8em',
            '& button': {
              zIndex: 1,
              borderRadius: 5,
              color: 'black',
            },
            '& button.Mui-selected': {
              color: 'black',
            },
          }}
          TabIndicatorProps={{
            sx: {
              height: '100%',
              backgroundColor: 'primary ',
              border: '2px solid primary',
              borderRadius: 5,
            }
          }}
        >
          <Tab label="Home" {...a11yProps(0)} sx={{ mx: '2em' }}/>
          <Tab label="Projects" {...a11yProps(1)} sx={{ mx: '2em' }} />
          <Tab label="Contact Me" {...a11yProps(2)} sx={{ mx: '2em' }} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Home 
          technologies={technologies}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Projects 
          projectsData={projectsData}
          loadingFirstImage={loadingFirstImage}
          setLoadingFirstIamge={setLoadingFirstIamge}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ContactMe />
      </CustomTabPanel>
    </Box>
  )
}

export default Client
