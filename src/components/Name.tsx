import { useEffect } from 'react';
import styles from './Name.module.scss';

import { DESCRIPTIONS } from '../data/descriptions';

export function Name() {
    useEffect(() => {
        const postNameDescribeBackgroundElement = document.querySelector(`.${styles.postNameDescribeBackground}`) as HTMLElement
        const postNameDescribeElement = document.querySelector(`.${styles.postNameDescribe}`) as HTMLElement

        let counter = 0

        function changeDescription() {
            postNameDescribeElement.style.opacity = '0'
            setTimeout(() => {
                postNameDescribeElement.textContent = DESCRIPTIONS[counter].text
                postNameDescribeElement.style.opacity = '1'
                postNameDescribeBackgroundElement.style.backgroundColor = DESCRIPTIONS[counter].color
                postNameDescribeBackgroundElement.style.width = (postNameDescribeElement.clientWidth + 16) + "px"
                postNameDescribeBackgroundElement.style.marginLeft = (-postNameDescribeElement.clientWidth - 8) + "px"
                counter = (counter + 1) % DESCRIPTIONS.length
            }, 1000)
        }

        // Initial change
        changeDescription()

        const intervalRef = setInterval(() => {
            changeDescription()
        }, 5000)

        return () => {
            clearInterval(intervalRef)
        }
    }, [])

    return (
        <div className={styles.nameWrapper} id={'nameWrapper'}>
            <div className={styles.nameContainer}>
                <h1 className={`${styles.preName} ${styles.slideFadeIn}`}>Hi! My name is</h1>
                <p className={`${styles.name} ${styles.slideFadeIn}`}>Nathanael Stephen E. Memis</p>
                <div className={`${styles.postNameContainer} ${styles.slideFadeIn}`}>
                    <h1 className={styles.postName}>I am a</h1>
                    <div className={styles.postNameDescribeContainer}>
                        <h1 className={styles.postNameDescribe}></h1>
                        <div className={styles.postNameDescribeBackground} />
                    </div>
                </div>
                <div className={`${styles.downlaodResumeContainer} ${styles.slideFadeIn}`}>
                    <a href='/NathanaelMemis_Resume.pdf' download>   
                        <p>
                            <img src="/images/download.png" alt="Download Resume" />
                            Download Resume
                        </p>
                    </a>
                    <div className={styles.antenna}>
                        <div className={styles.signal} />
                    </div>
                    <div className={styles.antenna2}>
                        <div className={styles.signal2} />
                    </div>
                </div>
            </div>
        </div>
    )
}