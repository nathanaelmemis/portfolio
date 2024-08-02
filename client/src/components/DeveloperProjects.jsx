import { signInWithCustomToken } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage";

import { auth, database as db, storage } from "../firebase";

import axios from 'axios'

import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, TextField, ImageList, ImageListItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Fade, Alert } from "@mui/material";
import { DeleteForever as DeleteForeverIcon } from '@mui/icons-material';

import ImagePreview from "../components/ImagePreview";

function DeveloperDashboard() {
	const [idToken, setIdToken] = useState('')
	const [projectsData, setProjectsData] = useState(null)
	const [projectEditingId, setProjectEditingId] = useState('')
	const [renderedProjectEditingMenuItem, setRenderedProjectEditingMenuItem] = useState([])
	const [isDataChanged, setIsDataChanged] = useState(false)
	const [isDataValid, setIsDataValid] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)

	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const [projectNumber, setProjectNumber] = useState('')
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [technologies, setTechnologies] = useState('')
	const [details, setDetails] = useState('')
	const [linkHref, setLinkHref] = useState('')
	const [linkText, setLinkText] = useState('')

	const [previewImages, setPreviewImages] = useState([])
	const [removedImages, setRemovedImages] = useState([])

	const developerToken = localStorage.getItem('developerToken')

	const navigate = useNavigate();

	async function handleOnChangeMenuSelect(e) {
		setProjectEditingId(e.target.value)

		if (!e.target.value) {
			setProjectNumber('')
			setName('')
			setDescription('')
			setTechnologies('')
			setDetails('')
			setLinkHref('')
			setLinkText('')
			setPreviewImages([])
			setRemovedImages([])
			return
		}

		const projectEditing = projectsData.docs.find(doc => doc.id === e.target.value).data()

		setProjectNumber(projectEditing.projectNumber)
		setName(projectEditing.name)
		setDescription(projectEditing.description)
		setTechnologies(projectEditing.technologies)
		setDetails(projectEditing.details)
		setLinkHref(projectEditing.link.href)
		setLinkText(projectEditing.link.text)
		setRemovedImages([])

		try {
			const fetchedImages = await Promise.all(
				projectEditing.pictures.map(async (imageUrl) => {

					const response = await axios.get(imageUrl, {
						responseType: 'blob', // Fetch as Blob (binary data)
					})

					const imageBlob = response.data

					imageBlob['imageUrl'] = imageUrl

					// Create an object URL from the Blob
					return imageBlob
				})
			);
			setPreviewImages(fetchedImages)
		} catch (err) {
			console.log('Error fetching images:', err);
		}
	}

	function handleError(error) {
		setIsLoading(false)
		setIsError(true)
		setErrorMessage(error.response.data.message ? error.response.data.message : error.code)
		console.log(error)
	}

	function parseImageUrl(imageUrl) {
		const firstSplit = imageUrl.split('?alt')[0]
		const secondSplit = firstSplit.split('%2F')
		return secondSplit[secondSplit.length - 1]
	}

	async function handleOnClickDeleteConfirmDialogYes() {
		setIsLoading(true)

		try {
			previewImages.forEach(async item => {
				await deleteObject(ref(storage, `pictures/${parseImageUrl(item.imageUrl)}`))
			})

			await axios.post('/api/delete', {
				idToken: idToken,
				projectId: projectEditingId
			})

			setProjectsData(await getDocs(query(collection(db, "projects"), orderBy('projectNumber'))))
			setProjectEditingId('')
			setShowDeleteConfirmDialog(false)
		} catch (error) {
			handleError(error)
		}
	}

	function handleOnChangeProjectTextFields(setFunction, e) {
		setFunction(e.target.value)
		setIsDataChanged(true)
		setIsError(false)
	}

	function handleOnClickCancelButton() {
		handleOnChangeMenuSelect({ target: { value: '' } })
		handleOnChangeMenuSelect({ target: { value: projectEditingId } })
		setIsDataChanged(false)
	}

	async function uploadImagesToStorageBucket(projectId) {
		// upload images to storage bucket
		const uploadedFileUrls = []
		let blobCounter = 0

		// upload new images to storage bucket
		const uploadPromises = previewImages.map(async (item, index) => {
			// To prevent re-upload of existing images in the storage bucket
			if (!item.name) { // Check if not a file
				blobCounter += 1;
				return
			}

			const imageUid = `${projectId}_${Date.now()}${index}_${item.name}`

			const storageRef = ref(storage, `pictures/${imageUid}`);
			await uploadBytes(storageRef, item); // Await the upload

			// Get the download URL and assign it to the correct index in the final array
			const downloadUrl = await getDownloadURL(storageRef);
			uploadedFileUrls[index - blobCounter] = downloadUrl;
		});

		// Wait for all uploads to complete
		await Promise.all(uploadPromises)

		return uploadedFileUrls
	}

	async function handleOnClickSaveButton() {
		setIsLoading(true)

		const uploadedFileUrls = await uploadImagesToStorageBucket(projectEditingId)

		const previousImageUrls = []

		previewImages.forEach(item => {
			if (item.name) { // check if file
				return
			}

			previousImageUrls.push(item.imageUrl)
		})

		// delete removed images from storage bucket
		removedImages.forEach(async imageName => {
			await deleteObject(ref(storage, `pictures/${imageName}`))
		})

		const projectDataToSend = {
			idToken: idToken,
			projectId: projectEditingId,
			projectNumber: projectNumber,
			name: name,
			description: description,
			technologies: technologies,
			details: details,
			pictures: [...previousImageUrls, ...uploadedFileUrls],
			link: {
				href: linkHref,
				text: linkText
			}
		}

		try {
			await axios.post('/api/save', projectDataToSend)

			setProjectsData(await getDocs(query(collection(db, "projects"), orderBy('projectNumber'))))
		} catch (error) {
			handleError(error)
		}
	}

	async function handleOnClickAddButton() {
		setIsLoading(true)

		// get new project id through api
		try {
			const res = await axios.post('/api/new_id', {
				idToken: idToken,
				projectId: ''
			})

			const projectId = res.data.data.projectId

			// upload images to storage bucket
			const uploadedFileUrls = await uploadImagesToStorageBucket(projectId)

			// add new project data to firestore
			const projectDataToSend = {
				idToken: idToken,
				projectId: projectId,
				projectNumber: projectNumber,
				name: name,
				description: description,
				technologies: technologies,
				details: details,
				pictures: uploadedFileUrls,
				link: {
					href: linkHref,
					text: linkText
				}
			}

			await axios.post('/api/save', projectDataToSend)

			setProjectsData(await getDocs(query(collection(db, "projects"), orderBy('projectNumber'))))
		} catch (error) {
			handleError(error)
		}
	}

	function handleFileChange(e) {
		setPreviewImages([...previewImages, ...Array.from(e.target.files)]);

		setIsDataChanged(true);

		e.target.value = '';
	}

	function handleOnClickDeleteImageButton(index, isFile) {
		if (!isFile) {
			setRemovedImages([...removedImages, parseImageUrl(previewImages[index].imageUrl)])
		}

		const previewImageTemp = [...previewImages]

		previewImageTemp.splice(index, 1)

		setPreviewImages([...previewImageTemp])

		setIsDataChanged(true)
	}

	// Authenticate token and get projects data
	useEffect(() => {
		async function authenticateTokenAndGetProjectsData() {
			try {
				await signInWithCustomToken(auth, developerToken)

				setIdToken(await auth.currentUser.getIdToken(true))
			} catch (error) {
				localStorage.removeItem('developerToken')
				navigate('/developer')
				return
			}

			setProjectsData(await getDocs(query(collection(db, "projects"), orderBy('projectNumber'))))
		}
		authenticateTokenAndGetProjectsData()
	}, [])

	// Render select projects editing menu items
	useEffect(() => {
		let renderedProjectEditingMenuItemTemp = []

		renderedProjectEditingMenuItemTemp.push(
			<MenuItem key={0} value={''}>
				<em>Add New Project</em>
			</MenuItem>
		)
	
		if (projectsData) {
			projectsData.forEach((doc) => {
				renderedProjectEditingMenuItemTemp.push(
					<MenuItem key={doc.id} value={doc.id}>{doc.data().name}</MenuItem>
				)
			})
		}

		setRenderedProjectEditingMenuItem(renderedProjectEditingMenuItemTemp)
		handleOnChangeMenuSelect({ target: { value: '' } })
		handleOnChangeMenuSelect({ target: { value: projectEditingId } })
		setIsDataChanged(false)
		setIsLoading(false)
	}, [projectsData])

	// Check validity every render
	useEffect(() => {
		setIsDataValid(projectNumber && name && description && technologies && details && previewImages.length && isDataChanged && !(!!linkHref ^ !!linkText))
	})

	return (
		<>
			<Box>
				<Box sx={{
					pt: '2em',
					mb: '3em',
					display: 'flex',
					alignItems: 'center',
				}}>
					<FormControl sx={{ width: '20em' }}>
						<InputLabel id="projectEditingLabel">Project Editing</InputLabel>
						<Select
							labelId="projectEditingLabel"
							value={projectEditingId}
							label="Project Editing"
							onChange={e => { handleOnChangeMenuSelect(e); setIsDataChanged(false); setIsDataValid(false) }}
						>
							{renderedProjectEditingMenuItem}
						</Select>
					</FormControl>
					<TextField
						label='No.'
						value={projectNumber}
						required
						type='number'
						onChange={e => handleOnChangeProjectTextFields((value) => { value >= 0 ? setProjectNumber(parseInt(value)) : setProjectNumber(0) }, e)}
						sx={{
							width: '5em',
							ml: '1em'
						}}>
					</TextField>
					<Box
						sx={{ display: projectEditingId ? 'auto' : 'none', ml: 'auto' }}>
						<Button variant="contained" color='error' onClick={() => setShowDeleteConfirmDialog(true)}>Delete</Button>
					</Box>
					<Dialog
						open={showDeleteConfirmDialog}
						onClose={() => setShowDeleteConfirmDialog(false)}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description">
						<DialogTitle id="alert-dialog-title">Delete project {name}?</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								This action is irreversible and may result to permanent loss of important data.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setShowDeleteConfirmDialog(false)} autoFocus>Cancel</Button>
							<Button color="error" onClick={handleOnClickDeleteConfirmDialogYes}>Yes</Button>
						</DialogActions>
					</Dialog>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column'
					}}>
					<TextField
						label='Name'
						value={name}
						required
						onChange={e => handleOnChangeProjectTextFields(setName, e)}
						sx={{
							mb: '1.5em',
							width: '20em'
						}}>
					</TextField>
					<TextField
						label='Description'
						value={description}
						required
						onChange={e => handleOnChangeProjectTextFields(setDescription, e)}
						maxRows={2}
						multiline
						sx={{
							mb: '1.5em',
							width: '40em'
						}}>
					</TextField>
					<TextField
						label='Technologies'
						value={technologies}
						required
						onChange={e => handleOnChangeProjectTextFields(setTechnologies, e)}
						sx={{
							mb: '1.5em',
							width: '40em'
						}}>
					</TextField>
					<TextField
						label='Details'
						value={details}
						required
						onChange={e => handleOnChangeProjectTextFields(setDetails, e)}
						maxRows={4}
						multiline
						sx={{
							mb: '1.5em',
							width: '40em'
						}}>
					</TextField>
					<Box>
						<TextField
							label='Link Href'
							value={linkHref}
							onChange={e => handleOnChangeProjectTextFields(setLinkHref, e)}
							sx={{
								mb: '1.5em',
								width: '23em'
							}}>
						</TextField>
						<TextField
							label='Link Text'
							value={linkText}
							onChange={e => handleOnChangeProjectTextFields(setLinkText, e)}
							sx={{
								ml: '1em',
								mb: '1.5em',
								width: '16em'
							}}>
						</TextField>
					</Box>
					<Box
						sx={{
							mt: '1.5em'
						}}>
						<Button
							disabled={!isDataChanged || isLoading}
							onClick={handleOnClickCancelButton}
							variant="contained"
							sx={{
								mr: '1em',
							}}>
							Cancel
						</Button>
						<LoadingButton
							loading={isLoading}
							onClick={projectEditingId ? handleOnClickSaveButton : handleOnClickAddButton}
							disabled={!isDataValid}
							variant="contained">
							{projectEditingId ? 'Save' : 'Add'}
						</LoadingButton>
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					alignItems: 'center',
					mt: '2em'
				}}>
				<ImageList
					rowHeight={200}
					cols={2}
					sx={{
						height: '500px',
						width: '650px',
						alignContent: 'flex-start',
						border: '2px solid #ccc',
						p: '1em',
						position: 'relative'
					}}>
					{!projectEditingId ? '' : previewImages.length ? '' :
						<ImageListItem
							sx={{
								position: 'absolute',
								top: '50%',
								left: '45%',
								transform: 'translate(50% 50%)'
							}}>
							<Typography>Loading...</Typography>
						</ImageListItem>}
					{previewImages.map((imageFile, index) => (
						<ImageListItem
							key={index}
							sx={{
								position: 'relative',
								width: '320px',
								height: '200px',
								overflow: 'hidden',
								display: 'flex',
								justifyContent: 'center',
								mb: '.125em'
							}}>
							<IconButton
								onClick={() => handleOnClickDeleteImageButton(index, !!imageFile.name)}
								sx={{
									position: 'absolute',
									top: '5px',
									left: '5px',
									backgroundColor: 'rgba(146, 146, 146, .9)',
									'&:hover': { backgroundColor: 'red' }
								}}>
								<DeleteForeverIcon sx={{ color: 'white' }} />
							</IconButton>
							<ImagePreview imageFile={imageFile} loading='lazy' />
						</ImageListItem>
					))}
				</ImageList>
				<Button
					disabled={isLoading}
					onClick={() => document.getElementById('imageUploadButton').click()}
					variant="contained">
					Upload
				</Button>
				<input
					id="imageUploadButton"
					multiple
					type="file"
					onChange={handleFileChange}
					style={{
						display: 'none'
					}} />
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
		</>
	)
}

export default DeveloperDashboard