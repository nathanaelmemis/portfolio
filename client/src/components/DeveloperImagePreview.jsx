import { useEffect, useState } from "react";

function ImagePreview({ imageFile, loading }) {
    const [previewFileUrl, setPreviewFileUrl] = useState('')

    useEffect(() => {
        const reader = new FileReader();

        reader.onload = (e) => {
            setPreviewFileUrl(e.target.result); // Set the preview URL
        }

        reader.readAsDataURL(imageFile)
    }, [imageFile])

    return (
        <img
            src={previewFileUrl}
            width={'320px'}
            height={'200px'}
            loading={loading}
            style={{
                objectFit: 'cover',
            }} />
    )
}

export default ImagePreview