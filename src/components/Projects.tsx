import styles from './Projects.module.scss'

import { PROJECTS, Project } from '../data/projects'

export function Projects() {
    return (
        <div className={styles.projectsContainer} id={'projectsContainer'}>
            {
                PROJECTS.map((project, index) => {
                    return (
                        <ProjectCard key={index} index={index} project={project}/>
                    )
                })
            }
        </div>
    )
}

interface ProjectCardProps {
    project: Project
    index: number
}

function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <div className={styles.scrollSlideFadeIn}>
            <div 
                className={styles.projectCard}
                style={{
                    animationDelay: `${Math.random() * 2}s`
                }}
            >
                <div className={styles.screenContainer}>
                    <Laptop 
                        index={index + 1}
                        alt={`${project.name} desktop`}
                        stretchImage={project.stretchImage}
                    />
                    {
                        project.hasMobile && 
                        <Mobile 
                            index={index + 1}
                            alt={`${project.name} mobile`}
                        />
                    }
                </div>
                <h3>{project.name}</h3>
                <p className={styles.description}>{project.description}</p>
                <div className={styles.linksContainer}>
                    {
                        project.links.map((link, index) => {
                            return (
                                <a 
                                    key={index} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                >
                                    {link.text}
                                </a>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

interface DeviceProps {
    index: number
    alt: string
}

interface LaptopProps extends DeviceProps {
    stretchImage: boolean
}

function Laptop({ index, alt, stretchImage }: LaptopProps) {
    return (
        <div className={styles.laptop}>
            <div className={styles.screen}>
                <a href={`./projectsImages/${index}_desktop.png`} target="_blank" rel="noreferrer">
                    <img 
                        src={`./projectsImages/${index}_desktop.png`}
                        alt={alt} 
                        style={{
                            objectFit: stretchImage ? 'fill' : 'cover'
                        }}
                    />
                </a>
            </div>
            <div className={styles.keyboard} />
        </div>
    )
}

function Mobile({ index, alt }: DeviceProps) {
    return (
        <div className={styles.mobile}>
            <a href={`./projectsImages/${index}_mobile.png`} target="_blank" rel="noreferrer">
                <img 
                    src={`./projectsImages/${index}_mobile.png`} 
                    alt={alt} 
                />
            </a>
        </div>
    )
}