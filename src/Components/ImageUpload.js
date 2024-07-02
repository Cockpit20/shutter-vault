import React, { useState } from 'react'

function ImageUpload() {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");

    const handleChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }

    const handleClick = () => {

    }

    return (
        <div>
            <input type='text' placeholder='Enter a caption...' onChange={(event) => setCaption(event.target.value)} value={caption} />
            <input type='file' onChange={handleChange} />
            <button onClick={handleClick}>Upload</button>
        </div>
    )
}

export default ImageUpload
