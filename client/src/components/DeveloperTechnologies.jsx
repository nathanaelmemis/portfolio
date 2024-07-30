import { signInWithCustomToken } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage";

import { auth, database as db, storage } from "../firebase";

import axios from 'axios'

import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Box, Fade, Button, Select, MenuItem, FormControl, InputLabel, TextField, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import zIndex from "@mui/material/styles/zIndex";
import { LoadingButton } from "@mui/lab";

function DeveloperTechnologies() {
	const [idToken, setIdToken] = useState('')
	const [technologies, setTechnologies] = useState(null)
	const [technologyEditingId, setTechnologyEditingId] = useState('')
	const [renderedTechnologiesEditingMenuItem, setRenderedTechnologiesEditingMenuItem] = useState([])
	const [isDataChanged, setIsDataChanged] = useState(false)
	const [isDataValid, setIsDataValid] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)

	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const [technologyName, setTechnologyName] = useState('')
	const [technologyLogo, setTechnologyLogo] = useState('')
	const [technologyNumber, setTechnologyNumber] = useState('')

	const [technologyLogoPreview, setTechnologyLogoPreview] = useState('')

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

		setRenderedTechnologiesEditingMenuItem(renderedTechnologiesEditingTemp)
		handleOnChangeMenuSelect({ target: { value: '' } })
		handleOnChangeMenuSelect({ target: { value: technologyEditingId } })
		setIsDataChanged(false)
		setIsLoading(false)
	}, [technologies])

	function setTechnologyData(technologyId) {
		if (technologyId === '') {
			setTechnologyName('')
			setTechnologyLogo('')
			setTechnologyLogoPreview('')
			setTechnologyNumber('')
			return
		}

		const technologyEditing = technologies.docs.find(doc => doc.id === technologyId).data()

		setTechnologyName(technologyEditing.name)
		setTechnologyLogo(technologyEditing.logo)
		setTechnologyLogoPreview(technologyEditing.logo)
		setTechnologyNumber(technologyEditing.technologyNumber)
	}

	function handleOnChangeMenuSelect(e) {
		setTechnologyEditingId(e.target.value);
		setTechnologyData(e.target.value);
		setIsDataChanged(false);
	}

	function handleOnClickCancelButton() {
		setTechnologyData(technologyEditingId);
	}

	function handleFileChange(e) {
		setTechnologyLogo(e.target.files[0]);

		const reader = new FileReader();

		reader.onload = (e) => {
			setTechnologyLogoPreview(e.target.result); // Set the preview URL
		}
	
		reader.readAsDataURL(e.target.files[0])

		e.target.value = '';
	}

	function handleOnChangeProjectTextFields(setFunction, e) {
		setFunction(e.target.value);
		setIsDataChanged(true);
	}

	// Check validity every render
	useEffect(() => {
		setIsDataValid(isDataChanged && technologyName !== '' && technologyNumber !== '' && technologyLogo !== '')
	})

	function handleError(error) {
		setIsLoading(false)
		setIsError(true)
		setErrorMessage(error.response.data.message ? error.response.data.message : error.code)
		console.log(error)
	}

	async function uploadImageToStorageBucket(imageFile) {
		try {
			// To prevent re-upload of existing images in the storage bucket
			if (!imageFile.name) { // Check if not a file
				return null
			}
	
			// Add random so when deleting file with same file name wouldn't be a problem
			const imageUid = `${Date.now()}_${imageFile.name}`
	
			// Get ref then upload the image
			const storageRef = ref(storage, `technologies/${imageUid}`);
			await uploadBytes(storageRef, imageFile); // Await the upload
	
			// Get the download URL
			const downloadUrl = await getDownloadURL(storageRef);
	
			return downloadUrl
		} catch (error) {
			handleError(error)
		}
	}

	async function uploadDataToFirestore(uploadedFileDownloadUrl, newTechnologyId = null) {
		try {
			const technologyDataToSend = {
				idToken: idToken,
				technologyId: newTechnologyId ? newTechnologyId : technologyEditingId, // distinguishes if data is added or saved
				name: technologyName,
				logo: uploadedFileDownloadUrl,
				technologyNumber: technologyNumber,
			}
		
			await axios.post('/api/save', technologyDataToSend)
	
			setTechnologies(await getDocs(query(collection(db, "technologies"), orderBy("technologyNumber"))))
		} catch (error) {
			handleError(error)
		}
	}

	function parseImageUrl(imageUrl) {
		const firstSplit = imageUrl.split('?alt')[0]
		const secondSplit = firstSplit.split('%2F')
		return secondSplit[secondSplit.length - 1]
	}

	async function handleOnClickSaveButton() {
		setIsLoading(true)

		try {
			// Upload image to storage bucket
			const uploadedFileDownloadUrl = await uploadImageToStorageBucket(technologyLogo)

			// Get technology editing data
			const technologyEditing = technologies.docs.find(doc => doc.id === technologyEditingId).data()

			// Delete previous image from storage bucket if uploaded new image
			if (uploadedFileDownloadUrl) {
				await deleteObject(ref(storage, `technologies/${parseImageUrl(technologyEditing.logo)}`))
			}

			await uploadDataToFirestore(uploadedFileDownloadUrl ? uploadedFileDownloadUrl : technologyEditing.logo)
		} catch (error) {
			handleError(error)
		}
	}

	async function handleOnClickAddButton() {
		setIsLoading(true)

		try {
			// Get new technology ID from api
			const res = await axios.post('/api/new_id', {
				idToken: idToken,
				technologyId: ''
			})

			const newTechnologyId = res.data.data.technologyId

			// Upload images to storage bucket
			const uploadedFileDownloadUrl = await uploadImageToStorageBucket(technologyLogo)

			await uploadDataToFirestore(uploadedFileDownloadUrl, newTechnologyId)
		} catch (error) {
			handleError(error)
		}
	}

	async function handleOnClickDeleteConfirmDialogYes() {
		setIsLoading(true)
		setTechnologyEditingId('')

		try {
			const technologyEditing = technologies.docs.find(doc => doc.id === technologyEditingId).data()

			await deleteObject(ref(storage, `technologies/${parseImageUrl(technologyEditing.logo)}`))

			await axios.post('/api/delete', {
				idToken: idToken,
				technologyId: technologyEditingId
			})

			setTechnologies(await getDocs(query(collection(db, "technologies"), orderBy("technologyNumber"))))
		} catch (err) {
			handleError(error)
		}

		setShowDeleteConfirmDialog(false)
	}

	return (
		<Box>

			{/* Technology editing Menu Select */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mt: '2em', 
					mb: '3em' 
				}}>
				<FormControl sx={{ width: '20em'}}>
					<InputLabel id="technologyEditingLabel">Technology Editing</InputLabel>
					<Select
						labelId="technologyEditingLabel"
						value={technologyEditingId}
						label="Technology Editing"
						onChange={e => handleOnChangeMenuSelect(e)}
					>
						{renderedTechnologiesEditingMenuItem}
					</Select>
				</FormControl>
				<Button 
					variant="contained" 
					color='error'
					onClick={() => setShowDeleteConfirmDialog(true)}
					sx={{
						display: technologyEditingId === '' ? 'none' : 'block'
					}}>Delete</Button>
				<Dialog
					open={showDeleteConfirmDialog}
					onClose={() => setShowDeleteConfirmDialog(false)}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">Delete project {technologyName}?</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							This action is irreversible and may result to permanent loss of important data.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowDeleteConfirmDialog(false)} autoFocus>Cancel</Button>
						<Button color="error" onClick={() => handleOnClickDeleteConfirmDialogYes()}>Yes</Button>
					</DialogActions>
				</Dialog>
			</Box>
			<Box
				sx={{
					display: 'flex',
				}}>

				{/* Image and image upload */}
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
					{technologyLogo === '' ? '' :
						<img
							width={'100%'}
							src={technologyLogoPreview}
							sx={{
								objectFit: 'contain',
								maxWidth: '100%',
								maxHeight: '100%',
							}} />}
					<input
						id="logoUploadButton"
						multiple
						type="file"
						onChange={(e) => handleFileChange(e)}
						style={{
							display: 'none'
						}} />
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
						onChange={(e) => handleOnChangeProjectTextFields(setTechnologyName, e)}
						sx={{
							mb: '1em'
						}} />
					<TextField
						required
						label="No."
						type="number"
						value={technologyNumber}
						onChange={(e) => handleOnChangeProjectTextFields(setTechnologyNumber, e.target.value >= 0 ? { target: { value: parseInt(e.target.value) } } : { target: { value: 0 } })}
						sx={{
							width: '8em',
						}} />
				</Box>
			</Box>

			{/* Cancel & Save/Add Buttons */}
			<Box
				sx={{
					mt: '3em',
				}}>
				<Button
					disabled={!isDataChanged || !isLoading}
					variant="contained"
					onClick={handleOnClickCancelButton}
					sx={{
						mr: '1em'
					}}>Cancel</Button>
				<LoadingButton
					loading={isLoading}
					disabled={!isDataValid}
					variant="contained"
					onClick={technologyEditingId ? handleOnClickSaveButton : handleOnClickAddButton}
				>
					{technologyEditingId ? 'Save' : 'Add'}</LoadingButton>
			</Box>

			<Fade in={isError && isDataChanged}>
				<Box 
					sx={{
						position: 'fixed',
						top: '0',
						left: '0', 
						width: '100vw',
						display: 'flex',
						justifyContent: 'center',
						zIndex: 9999,
						mt: '10px'
					}}>
					<Alert
						open
						onClose={() => setIsError(false)}
						variant='filled'
						severity="error">
						{errorMessage}
					</Alert>
				</Box>
			</Fade>
		</Box>
	);
}

export default DeveloperTechnologies;