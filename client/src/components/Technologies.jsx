import { Box } from '@mui/material';
import { useEffect, useState, useRef } from 'react';

function Technologies({ technologiesDocs, height, sx, fadeWidth }) {
    const [renderedTechnologies, setRenderedTechnologies] = useState(null)
    const technologiesElementRef = useRef(null)
    const [technologiesElementWidth, setTechnologiesElementWidth] = useState(0);

    // Resize observer for technologies element
    useEffect(() => {
        const handleResize = (entries) => {
        for (let entry of entries) {
            setTechnologiesElementWidth(entry.contentRect.width);
        }
        };

        const resizeObserver = new ResizeObserver(handleResize);

        if (technologiesElementRef.current) {
            resizeObserver.observe(technologiesElementRef.current);
        }

        return () => {
        if (technologiesElementRef.current) {
            resizeObserver.unobserve(technologiesElementRef.current);
        }
        };
    }, []);

    // Preprocess and render technologies
    useEffect(() => {
        let technologies = technologiesDocs
        // Duplicate technologies data if width is less than the technologies element width
        if (technologies.length * parseInt(height) < technologiesElementWidth) {
            const numberOfDuplicatesNeeded = Math.ceil(technologiesElementWidth / (technologies.length * parseInt(height)))
            technologies = [].concat.apply([], Array(numberOfDuplicatesNeeded).fill(technologies))
        }

        // Create keyframes
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerHTML += `
            @keyframes scrollLeft {
                from {
                    left: 100%;
                }
                to {
                    left: calc(100% - ${technologies.length * parseInt(height) * 1.25}px);
                }
            }
        `
        document.head.appendChild(styleSheet);

        // Render technologies
        const renderedTechnologiesTemp = []
        technologies.forEach((doc, index) => {
            const technology = doc.data()
            renderedTechnologiesTemp.push(
                <Box
                    width={height}
                    height={height}
                    key={Math.random()}
                    sx={{
                        left: `calc(100% - ${technologies.length * parseInt(height) * 1.25}px)`,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: `scrollLeft ${technologies.length * 1}s infinite ${index * 1 + .25}s linear`,
                    }}>
                    <img 
                        src={technology.logo} 
                        width={'100%'}
                        title={technology.name} 
                        style={{ 
                            objectFit: 'contain',
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }} />
                </Box>
            )
        })

        setRenderedTechnologies(renderedTechnologiesTemp)
    }, [technologiesElementWidth])

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
            ref={technologiesElementRef}
            height={height}
            sx={{
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
                ...sx
            }}>
            {FadeBox('left')}
            {!renderedTechnologies ? '' : renderedTechnologies}
            {FadeBox('right')}
        </Box>
    )
}

export default Technologies