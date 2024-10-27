import './App.module.scss'
import styles from './App.module.scss'
import { ContactMeAndFindMeOn } from './components/ContactMeAndFindMeOn'
import { Name } from './components/Name'
import { Projects } from './components/Projects'

import { SpaceBackground } from "./components/SpaceBackground"
import { Technologies } from './components/Technologies'

function App() {
    return (
        <div className={styles.appContainer} id={'appContainer'}>
            <SpaceBackground />

            <Name />
            <Projects />
            <Technologies />
            <ContactMeAndFindMeOn />
        </div>
    )
}

export default App
