import { auth } from "../firebase";

import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Container, Button, Select, MenuItem, FormControl } from "@mui/material";

import DeveloperProjects from "../components/DeveloperProjects";
import DeveloperTechnologies from "../components/DeveloperTechnologies";

function DeveloperDashboard() {
	const [settings, setSettings] = useState(0)

	const navigate = useNavigate();

	async function handleLogout() {
		await auth.signOut()
		localStorage.removeItem('developerToken')
		navigate('/developer')
	}

	function handleOnChangeSettings(event) {
		setSettings(event.target.value)
	}

	return (
		<Container
			maxWidth={'xl'}
			sx={{
				mt: '4em',
				display: 'flex'
			}}>
			<AppBar>
				<Toolbar>
					<FormControl>
						<Select
							disableUnderline
							variant="standard"
							value={settings}
							onChange={handleOnChangeSettings}
							sx={{ 
								color: 'white',
								fontSize: '1.25em',
								pr: '.25em',
							}}
						>
							<MenuItem value={0}>Projects</MenuItem>
							<MenuItem value={1}>Technologies</MenuItem>
						</Select>
					</FormControl>
					<Box 
						sx={{
							flexGrow: 1
						}}/>
					<Button
						onClick={handleLogout}
						color="inherit"
						sx={{
							textTransform: 'none',
							fontSize: '1.25em',
						}}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>
			{settings === 0 && <DeveloperProjects />}
			{settings === 1 && <DeveloperTechnologies />}
		</Container>
	)
}

export default DeveloperDashboard