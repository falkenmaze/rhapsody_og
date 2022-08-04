import React, { useState } from 'react'
import InputUnstyled  from '@mui/base/InputUnstyled'
import Button from '@mui/material/Button'
import {storage,db} from './Firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref,uploadBytesResumable,getDownloadURL } from 'firebase/storage'
import './imageupload.css'

async function setdocument(downurl,comment, username)
{
    await setDoc(doc(db, "posts", `${comment}`), {
        timestamp: serverTimestamp(),
        caption: comment,
        imageUrl: downurl,
        username: username
    })
}

function ImageUpload({username}) {
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState("")
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState("")

    const handleChange = (e) => {
        if (e.target.files[0])
        {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const storageref = ref(storage, `/images/${image.name}`)
        const uploadTask = uploadBytesResumable(storageref, image)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(prog)
            },
            (error) => {
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downurl) => {
                    setdocument(downurl, caption, username)
                })
                // setProgress(0)
                setCaption("")
                setImage(null)
            }
        )
        setProgress(0)
    }
    return (
    <div className="imageupload">
        <progress className="imageupload__progress" value={progress} max="100"/>
        <InputUnstyled type="text" placeholder="Enter a Comment" value={caption} onChange={event => setCaption(event.target.value)} multiline/>
        <InputUnstyled sx={{color: 'white'}} type="file" onChange={handleChange}/>
        <Button onClick={handleUpload} variant='contained' size='small' sx={{objectFit: 'contain'}}>Upload</Button>
    </div>
  )
}

export default ImageUpload