import { useEffect, useState } from "react";

import { Box, Pagination } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

function ZoomedImagePreview({ images, handleOnClose }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        setCurrentImageIndex(0)
    }, [images])

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
                        borderRadius: 5,
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
                    src={images[currentImageIndex]}
                    width={'720px'}
                />
                <Pagination
                    count={images.length}
                    page={currentImageIndex + 1}
                    color={'secondary'}
                    onChange={(event, value) => setCurrentImageIndex(value - 1)}
                    sx={{
                        position: 'absolute',
                        bottom: '.5em',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                />
            </Box>
        </>
    )
}

export default ZoomedImagePreview