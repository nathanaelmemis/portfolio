import { signInWithCustomToken } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage";

import { auth, database as db, storage } from "../firebase";

import { useEffect, useState } from "react"

import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, TextField, ImageListItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import zIndex from "@mui/material/styles/zIndex";

function DeveloperTechnologies() {
	const [idToken, setIdToken] = useState('')
	const [technologies, setTechnologies] = useState(null)
	const [technologyEditingId, setTechnologyEditing] = useState('')
	const [renderedTechnologiesEditing, setRenderedTechnologiesEditing] = useState(0)
	const [isDataChanged, setIsDataChanged] = useState(false)
  	const [isDataValid, setIsDataValid] = useState(false)
	
	const [technologyName, setTechnologyName] = useState('')
	const [technologyLogo, setTechnologyLogo] = useState('')
	const [technologyNumber, setTechnologyNumber] = useState('')

	const developerToken = localStorage.getItem('developerToken')
	const navigate = useNavigate();

	// Authenticate token and get projects data
	useEffect(() => {
		async function authenticateTokenAndGetTechnologiesData() {
			try {
				await signInWithCustomToken(auth, developerToken)

				setIdToken(await auth.currentUser.getIdToken(true))
			} catch (error) {
				localStorage.removeItem('developerToken')
				navigate('/developer')
				return
			}

			setTechnologies(await getDocs(query(collection(db, "technologies"), orderBy("technologyNumber"))))
		}
		authenticateTokenAndGetTechnologiesData()
	}, [])

	// Render select technology editing menu items
	useEffect(() => {
		let renderedTechnologiesEditingTemp = []

		renderedTechnologiesEditingTemp.push(
			<MenuItem key={0} value={''}>
				<em>Add New Technology</em>
			</MenuItem>
		)

		if (technologies) {
			technologies.forEach((doc) => {
				renderedTechnologiesEditingTemp.push(
				<MenuItem key={doc.id} value={doc.id}>{doc.data().name}</MenuItem>
			)
			})
		}

		setRenderedTechnologiesEditing(renderedTechnologiesEditingTemp)
	}, [technologies])

	function setTechnologyData(technologyId) {
		if (technologyId === '') {
			setTechnologyName('')
			setTechnologyLogo('')
			setTechnologyNumber('')
			return
		}

		const technologyEditing = technologies.docs.find(doc => doc.id === technologyId).data()

		setTechnologyName(technologyEditing.name)
		setTechnologyLogo(technologyEditing.logo)
		setTechnologyNumber(technologyEditing.technologyNumber)
	}

	const handleOnChangeMenuSelect = (e) => {
		setTechnologyEditing(e.target.value)
		setTechnologyData(e.target.value)
		setIsDataChanged(false)
	}

	const handleOnClickCancelButton = () => {
		setTechnologyData(technologyEditingId)
	}

	const handleFileChange = (e) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			setTechnologyLogo(e.target.result); // Set the preview URL
		}

		reader.readAsDataURL(e.target.files[0])

		e.target.value = ''
	}
	
	const handleOnChangeProjectTextFields = (setFunction, e) => {
		setFunction(e.target.value)
		setIsDataChanged(true)
	}

	// Check validity every render
	useEffect(() => {
		setIsDataValid(isDataChanged && technologyName !== '' && technologyNumber !== '' && technologyLogo !== '')
	})

	// TODO: Add save technology handler

	return (
		<Box>

			{/* Technology editing Menu Select */}
			<FormControl sx={{ width: '20em', mt: '2em', mb: '3em' }}>
				<InputLabel id="technologyEditingLabel">Technology Editing</InputLabel>
				<Select
					labelId="technologyEditingLabel"
					value={technologyEditingId}
					label="Technology Editing"
					onChange={e => { handleOnChangeMenuSelect(e) }}
					>
					{renderedTechnologiesEditing}
				</Select>
			</FormControl>
			<Box 
				sx={{
					display: 'flex',
				}}>

				{/* Image upload */}
				<Box
					width={'320px'}
					height={'320px'}
					onClick={() => document.getElementById('logoUploadButton').click()}
					sx={{
						border: '2px solid red',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						mr: '1em',
						cursor: 'pointer',
						transition: 'all .5s',
						'&:hover': {
							border: '2px solid blue',
							backgroundColor: 'rgba(0, 0, 0, .2)',
						}
					}}>
					<img
						width={'100%'}
						src={technologyLogo}/>
					<input
						id="logoUploadButton"
						multiple
						type="file"
						onChange={ (e) => handleFileChange(e) } 
						style={{
							display: 'none'
						}}/>
				</Box>

				{/* Text fields */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}>
					<TextField 
						required
						label="Technology Name"
						value={technologyName}
						onChange={ (e) => handleOnChangeProjectTextFields(setTechnologyName, e) }
						sx={{
							mb: '1em'
						}}/>
					<TextField 
						required
						label="No."
						type="number"
						value={technologyNumber}
						onChange={ (e) => handleOnChangeProjectTextFields(setTechnologyNumber, e.target.value < 0 ? { target: { value: 0 } } : e) }
						sx={{
							width: '8em',
						}}/>
				</Box>
			</Box>

			{/* Cancel & Save Buttons */}
			<Box 
				sx={{
					mt: '3em',
				}}>
				<Button
					disabled={!isDataChanged}
					variant="contained"
					onClick={ () => handleOnClickCancelButton() }
					sx={{
						mr: '1em'
					}}>Cancel</Button>
				<Button
					disabled={!isDataValid}
					variant="contained">Save</Button>
			</Box>
		</Box>
	);
}

export default DeveloperTechnologies;