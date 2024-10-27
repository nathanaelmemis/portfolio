import styles from './Technologies.module.scss';

import { TECHNOLOGIES } from '../data/technolgies';

export function Technologies() {
  return (
    <div className={styles.technologiesContainer} id={'technologiesContainer'}>
        <h1 className={styles.scrollSlideFadeIn}>Technologies</h1>
        <div className={styles.technologiesItemsContainer}>
            {
                TECHNOLOGIES.map((technology, index) => {
                    return (
                        <div
                            className={`${styles.technologyWrapper} ${styles.scrollSlideFadeIn}`} 
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                            key={index}
                            onMouseOver={(e) => {
                                e.currentTarget.id = styles.hoveredTechnology
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.id = ''
                            }}
                        >
                            <p className={styles.technology}>
                                {technology}
                            </p>
                        </div>
                    )
                })
            }
        </div>
    </div>
  );
}