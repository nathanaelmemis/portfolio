import { Box } from '@mui/material';
import { useEffect } from 'react';

function Technologies({ technologies, height, sx, fadeWidth, mouseInteraction = true }) {
    function handleTechnologiesMouseOver() {
        const technologiesElement = document.querySelectorAll('#technology')
        technologiesElement.forEach((element) => {
            element.style.animationPlayState = 'paused'
        })
    }

    function handleTechnologiesMouseOut() {
        const technologiesElement = document.querySelectorAll('#technology')
        technologiesElement.forEach((element) => {
            element.style.animationPlayState = 'running'
        })
    }

    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';

        styleSheet.innerHTML += `
            @keyframes scrollLeft {
                0% {
                    left: 100%;
                }
                to {
                    left: calc(100% - ${Object.keys(technologies).length * parseInt(height) * 1.25}px);
                }
            }
        `

        document.head.appendChild(styleSheet);
    })

    const FadeBox = (direction) => {
        return (
            <Box
                width={fadeWidth}
                height={height}
                sx={{
                    left: direction === 'left' ? 0 : '',
                    right: direction === 'right' ? 0 : '',
                    zIndex: 1,
                    position: 'absolute',
                    background: `linear-gradient(to ${direction}, transparent, rgba(255, 255, 255, 1))`
                }} />
        )
    }

    return (
        <Box
            height={height}
            onMouseOver={mouseInteraction ? handleTechnologiesMouseOver : () => {}}
            onMouseOut={mouseInteraction ? handleTechnologiesMouseOut : () => {}}
            sx={{
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
                ...sx
            }}>
            {FadeBox('left')}
            {
                Object.entries(technologies).map(([key, value], index) => {
                    return (
                        <Box
                            id={'technology'}
                            width={height}
                            height={height}
                            key={key}
                            data-index={index}
                            sx={{
                                left: `calc(100% - ${Object.keys(technologies).length * parseInt(height) * 1.25}px)`,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: `scrollLeft ${Object.keys(technologies).length * 1}s infinite ${index * 1 + .25}s linear`,
                            }}>
                            <img src={value} width={'64px'} title={key} style={{ objectFit: 'contain' }} />
                        </Box>
                    )
                })
            }
            {FadeBox('right')}
        </Box>
    )
}

export default Technologies