import { useEffect, useState } from "react";

import { Box, Pagination } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

function ZoomedImagePreview({ images, handleOnClose }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [previewImage, setPreviewImage] = useState('')
    const [isLandscape, setIsLandscape] = useState(true)

    // Set initial preview image
    useEffect(() => {
        setCurrentImageIndex(0)
        setPreviewImage(images[0])
    }, [images])

    // Set object-fit property based on image aspect ratio
    useEffect(() => {
        const imageElement = document.querySelector('.zoomed-responsive-image');

        console.log(imageElement)

        if (!imageElement) {
            return
        }

        const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight

        if (aspectRatio > 1) {
            // Landscape
            imageElement.style.objectFit = 'auto';
            setIsLandscape(true)
            console.log('landscape')
        } else {
            // Portrait
            imageElement.style.objectFit = 'scale-down';
            setIsLandscape(false)
            console.log('portrait')
        }
    }, [previewImage])

    function handleOnChangePagination(value) {
        setCurrentImageIndex(value - 1)
        setPreviewImage(images[value - 1])
    }

    return (
        images.length <= 0 ? <></> : <>

            {/* Backdrop */}
            <Box
                onClick={handleOnClose}
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, .7)',
                    zIndex: 3
                }}
            />

            {/* Image preview */}
            <Box 
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    zIndex: 4,
                    pb: '3em',
                    borderRadius: 5,
                    width: !isLandscape ? '960px' : undefined,
                    backgroundColor: 'gray',
                }
            }>
                <Box
                    sx={{
                        width: '100%',
                        height: '3em',
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        borderRadius: '25px 25px 0 0',
                    }}
                >
                    <CloseIcon 
                        onClick={handleOnClose}
                        sx={{
                            mr: '.75em',
                            cursor: 'pointer'
                        }}/>
                </Box>
                <img 
                    className="zoomed-responsive-image"
                    src={previewImage}
                    width={!isLandscape ? '960px' : undefined}
                    height={'600px'}
                    style={{
                        objectFit: 'auto',
                    }}
                />
                <Box
                    sx={{
                        backgroundColor: 'white',
                        width: '100%',
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        p: '.75em 0',
                        borderRadius: '0 0 25px 25px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Pagination
                        count={images.length}
                        page={currentImageIndex + 1}
                        color={'secondary'}
                        onChange={(event, value) => handleOnChangePagination(value)}
                    />
                </Box>
            </Box>
        </>
    )
}

export default ZoomedImagePreview