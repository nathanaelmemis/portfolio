import styles from './ContactMe.module.scss';

export function ContactMeAndFindMeOn() {
    return(
        <div className={styles.contactMeAndFindMeOnContainer}>
            <div className={`${styles.contactMeContainer} ${styles.scrollSlideFadeIn}`}>
                <h1>Contact Me</h1>
                <div className={styles.infoContainer}>
                    <p>nathanaelmemis@gmail.com</p>
                    <p>09194701004</p>
                </div>
            </div>
            <div className={`${styles.findMeOnContainer} ${styles.scrollSlideFadeIn}`}>  
                <h1>Find Me On</h1>
                <div className={styles.linksContainer}>
                    <a href="https://www.linkedin.com/in/nathanaelmemis/" target="_blank" rel="noreferrer">
                        <img src="/findMeOnImages/linkedin.png" alt="LinkedIn Icon"/>
                    </a>
                    <a href="https://github.com/nathanaelmemis" target="_blank" rel="noreferrer">
                        <img src="/findMeOnImages/github.png" alt="Github Icon"/>
                    </a>
                </div>
            </div>
        </div>
    )
}