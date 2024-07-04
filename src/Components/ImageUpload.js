import React, { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig"
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ImageUpload.css'


function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }

    const handleUpload = () => {
        if (!image) {
            alert("No file(s) selected")
            return;
        }
        if (!caption) {
            alert("Caption cannot be empty")
            return
        }
        const storageRef = ref(storage, `images/${image.name}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error('Upload failed', error);
                alert(error.message);
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    addDoc(collection(db, "posts"), {
                        timestamp: serverTimestamp(),
                        caption: caption,
                        imageURL: downloadURL,
                        username: username
                    });
                    console.log(username)
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
    }

    return (
        <div className='imageupload'>
            <progress className='imageupload__progress' value={progress} max="100" />
            <input type='text' placeholder='Enter a caption...' onChange={(event) => setCaption(event.target.value)} value={caption} />
            <input type='file' onChange={handleChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    )
}

export default ImageUpload
