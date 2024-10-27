import { ReactElement, useEffect, useRef, useState } from 'react'
import { useMousePosition } from '../hooks/MousePositionHook'
import styles from './SpaceBackground.module.scss'

const STAR_SIZE_PX = 64 // px
const MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX = 100
const WEBSITE_HEIGHT_REDUCE = .6
const ELEMENTS_TO_IGNORE = 3 // SpaceBackground, SpaceShip, and SpaceStation

export function SpaceBackground() {
    const stars = useRef<ReactElement[]>()
    const [websiteHeight, setWebsiteHeight] = useState(window.innerHeight)
    const spaceShip = useRef<ReactElement>()
    const mousePosition = useMousePosition()
    const isTouchDevice = window.matchMedia("(any-hover: none)").matches

    useEffect(() => {
        const appContainerElement = document.querySelector('#appContainer')

        if (!appContainerElement) {
            return
        }

        let actualWebsiteHeight = Array.from(appContainerElement.children).reduce((acc, element, index) => {
            if (index < ELEMENTS_TO_IGNORE) {
                return acc
            }

            return acc + (element as HTMLElement).getBoundingClientRect().height
        }, 0) * WEBSITE_HEIGHT_REDUCE

        stars.current = new Array(
            Math.floor((window.innerWidth + MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX) * (actualWebsiteHeight + MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX) / (STAR_SIZE_PX * STAR_SIZE_PX)))
            .fill(0).map((_, index) => <Star key={index} />)

        const spaceElement = document.querySelector(`.${styles.space}`) as HTMLElement
        spaceElement.style.height = `${actualWebsiteHeight + MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX}px`
        spaceElement.style.width = `${window.innerWidth + MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX}px`

        spaceShip.current = <SpaceShip websiteHeight={actualWebsiteHeight} />

        setWebsiteHeight(actualWebsiteHeight)
    }, [window.innerWidth, window.innerHeight])

    return (
        <>
            <div 
                className={styles.space}
                style={{
                    top: `calc(${-((isTouchDevice ? 0 : mousePosition.y - (websiteHeight / 2)) / (websiteHeight / 2)) * MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX - MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX}px)`,
                    left: `calc(${-((isTouchDevice ? 0 : mousePosition.x - (window.innerWidth / 2)) / (window.innerWidth / 2)) * MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX - MOUSE_PARALLAX_EFFECT_MAX_MOVEMENT_PX}px)`
                }}
            >
                { stars.current }
            </div>
            { spaceShip.current }
            <SpaceStation />
        </>
    )
}

function Star() {
    return (
        <div 
            className={styles.starContainer}
            style={{
                width: `${STAR_SIZE_PX}px`,
                height: `${STAR_SIZE_PX}px`,
            }}
        >
            <div className={styles.star}
                style={{
                    fontSize: `${(Math.random() * 10) % 2}px`,
                    left: `${(Math.random() * 100)}%`,
                    top: `${(Math.random() * 100)}%`,
                    animationDelay: `${Math.random() * 10 % 3}s`,
                    animationDuration: `${(Math.random() * 10 + 3)}s`
                }}
            />
        </div>
    )
}

interface SpaceShipProps {
    websiteHeight: number
}

function SpaceShip({ websiteHeight }: SpaceShipProps) {
    useEffect(() => {
        let spaceShipPosition = { x: 20, y: 20, rotateDeg: 0 }

        const acutaulWebsiteHeight = websiteHeight / WEBSITE_HEIGHT_REDUCE

        const spaceShipElement = document.querySelector(`.${styles.spaceShip}`) as HTMLElement
        const spaceShipLeftThrusterFlameElement = document.querySelector(`.${styles.leftThrusterFlameWrapper}`) as HTMLElement
        const spaceShipRightThrusterFlameElement = document.querySelector(`.${styles.rightThrusterFlameWrapper}`) as HTMLElement
        const spaceShipMainEngineFlameElement = document.querySelector(`.${styles.mainEngineFlame}`) as HTMLElement

        function moveSpaceShipToRandomPosition() {
            spaceShipElement.removeEventListener('click', handleClick)

            // new position and rotation
            // pattern is Q2 => Q3 => Q1 => Q4 => repeat
            function generateNewPosition () {
                // Q2 to Q3
                if (spaceShipPosition.x < (window.innerWidth / 2) && spaceShipPosition.y < (acutaulWebsiteHeight / 2)) {
                    return [
                        Math.random() * (window.innerWidth / 2), 
                        Math.random() * (acutaulWebsiteHeight - (acutaulWebsiteHeight / 2)) + (acutaulWebsiteHeight / 2)
                    ]
                // Q3 to Q1
                } else if (spaceShipPosition.x < (window.innerWidth / 2) && spaceShipPosition.y > (acutaulWebsiteHeight / 2)) {
                    return [
                        Math.random() * (window.innerWidth - (window.innerWidth / 2)) + (window.innerWidth / 2), 
                        Math.random() * (acutaulWebsiteHeight / 2)
                    ]
                // Q1 to Q4
                } else if (spaceShipPosition.x > (window.innerWidth / 2) && spaceShipPosition.y < (acutaulWebsiteHeight / 2)) {
                    return [
                        Math.random() * (window.innerWidth - (window.innerWidth / 2)) + (window.innerWidth / 2),
                        Math.random() * (acutaulWebsiteHeight - (acutaulWebsiteHeight / 2)) + (acutaulWebsiteHeight / 2)
                    ]
                // Q4 to Q2
                } else {
                    return [
                        Math.random() * (window.innerWidth / 2),
                        Math.random() * (acutaulWebsiteHeight / 2)
                    ]
                }
            }
            const [newX, newY] = generateNewPosition()
            // we are using the arc tangent to calculate the angle between the space ship and the new position
            // then we subtract it from 90 to get the angle we need to rotate the space ship relative to the positive y-axis
            let newRotateDeg = 90 - Math.atan2(-newY + spaceShipPosition.y, newX - spaceShipPosition.x) * (180 / Math.PI);

            // give space ship new position and rotation
            spaceShipElement.style.rotate = `${newRotateDeg}deg`
            spaceShipElement.style.cursor = 'default'

            // determine which thruster to turn on based on rotation
            if (spaceShipPosition.rotateDeg - newRotateDeg < 0) {
                spaceShipLeftThrusterFlameElement.style.opacity = '1'
            } else {
                spaceShipRightThrusterFlameElement.style.opacity = '1'
            }
            
            // turn on side thruster
            setTimeout(() => {
                spaceShipLeftThrusterFlameElement.style.opacity = '0'
                spaceShipRightThrusterFlameElement.style.opacity = '0'
            }, 2500)

            // turn on main engine and turn off side thruster
            setTimeout(() => {
                spaceShipMainEngineFlameElement.style.opacity = '1'
                spaceShipElement.style.top = `${newY}px`
                spaceShipElement.style.left = `${newX}px`
            }, 5000)

            // turn off main engine
            setTimeout(() => {
                spaceShipMainEngineFlameElement.style.opacity = '0'
            }, 6500)

            spaceShipPosition = { x: newX, y: newY, rotateDeg: newRotateDeg }
            spaceShipElement.style.cursor = 'pointer'

            setTimeout(() => {
                spaceShipElement.addEventListener('click', handleClick)
            }, 15000)
        }

        moveSpaceShipToRandomPosition()

        let intervalRef = setInterval(moveSpaceShipToRandomPosition, 20000)

        function handleClick() {
            clearInterval(intervalRef)
            moveSpaceShipToRandomPosition()
            intervalRef = setInterval(moveSpaceShipToRandomPosition, 20000)
        }

        return () => {
            clearInterval(intervalRef)
            spaceShipElement.removeEventListener('click', handleClick)
        }
    }, [window.innerWidth, websiteHeight])

    return (
        <div className={styles.spaceShip}>
            <div className={styles.head} />
            <div className={styles.body}>
                <div className={styles.leftThrusterFlameWrapper}>
                    <div className={styles.leftThrusterFlame} />
                </div>
                <div className={styles.window} />
                <div className={styles.rightThrusterFlameWrapper}>
                    <div className={styles.rightThrusterFlame} />
                </div>
            </div>
            <div className={styles.tail}>
                <div className={styles.leftTriangle} />
                <div className={styles.center} />
                <div className={styles.rightTriangle} />
            </div>
            <div className={styles.mainEngineFlame} />
        </div>
    )
}

function SpaceStation() {
    return (
        <div className={styles.spaceStationArea}>
            <div className={styles.spaceStation}>
                <div className={styles.leftWing}>
                    <div className={styles.firstPanel} />
                    <div className={styles.secondPanel} />
                </div>
                <div className={styles.mainModule}>
                    <div className={styles.upperDome} />
                    <div className={styles.middlePart}>
                        <div className={styles.signal} />
                    </div>
                    <div className={styles.lowerDome} />
                </div>
                <div className={styles.rightWing}>
                    <div className={styles.firstPanel} />
                    <div className={styles.secondPanel} />
                </div>
            </div>
        </div>
    )
}