import { useState, useEffect } from 'react';
import './App.css';
import Posts from './Posts.js'
import ImageUpload from './ImageUpload.js'
import { db,auth } from './Firebase.js'
import { createUserWithEmailAndPassword,onAuthStateChanged,updateProfile,signOut,signInWithEmailAndPassword } from 'firebase/auth'
import { collection, getDocs,orderBy,query } from "firebase/firestore";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; 
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input'

async function get_document(set_method)
{
  // let snapshot = await getDocs(collection(db, "posts"))
  // let snapshots = []
  // snapshot.forEach((doc) => {
  //   let obj = {
  //     id: doc.id,
  //     post: doc.data()
  //   }
  //   snapshots.push(obj)
  // })
  // set_method(snapshots)
  let post_data = []
  const q = collection(db,"posts")
  const snapshots = await getDocs(q)
  snapshots.forEach((doc) => {
    let obj = {
      id: doc.id,
      post: doc.data()
    }
    post_data.push(obj)
  })
  set_method(post_data)
}
function App() {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user)
      {
        console.log(user)
        setUser(user)
        if (user.displayName)
        {
          //don't update username
        }
        else
        {
          return updateProfile(user, {
            displayName: username
          })
        }
      }
      else
      {
        setUser(null)
      }
    })

    return (() => {
      unsubscribe()
    })
  }, [user, username])

  useEffect(() => {
    // let snapshots = getDocs(collection(db, 'posts'))
    // snapshots.map((doc) => {
    //   setPosts(doc.data())
    // });
    get_document(setPosts)
    },[])
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    textAlign: 'center',
    bgcolor: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const signUp = (event) => {
    event.preventDefault()
    createUserWithEmailAndPassword(auth, email, password).then((usercreds) => {
      return updateProfile(usercreds.user, {
        displayName: username
      })
    }).catch((error) => {
      alert(error.message)
    })
  }

  const signIn = (event) => {
    event.preventDefault()
    signInWithEmailAndPassword(auth,email,password)
      .catch((error) => {
        alert(error.message)
      })
  }

  return (
    <div className="app">
      <Modal
      open={open}
      onClose={() => setOpen(false)}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <form className="app__signup">
              <center>
                <h1 className="app__headerImage">Rhapsody</h1>
              </center> 
              <Input
              placeholder="username"
              style={{backgroundColor: 'white'}}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />
              <Input
              placeholder="email"
              style={{backgroundColor: 'white'}}
              type="text"
              value = {email}
              onChange={(e) => setEmail(e.target.value)}
              />
              <Input
              placeholder="password"
              style={{backgroundColor: 'white'}}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={(e) => {signUp(e);setOpen(false)}} variant="contained" disableElevation sx={{margin: 1}} type="submit">Sign Up</Button>
            </form>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <form className="app__signup">
              <center>
                <h1 className="app__headerImage">Rhapsody</h1>
              </center> 
              <Input
              placeholder="email"
              style={{backgroundColor: 'white'}}
              type="text"
              value = {email}
              onChange={(e) => setEmail(e.target.value)}
              />
              <Input
              placeholder="password"
              style={{backgroundColor: 'white'}}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={(e) => {signIn(e);setOpenSignIn(false)}} variant="contained" disableElevation sx={{margin: 1}} type="submit">Sign In</Button>
            </form>
          </Typography>
        </Box>
      </Modal>

      <div className="app__header">
        <h1 className="app__headerImage">Rhapsody</h1>
        {user ? (
        <Button variant="contained" onClick={()  => signOut(auth)} sx = {{marginBottom: 2, marginLeft: 2}} disableElevation>Log Out</Button>
      ): (
        <div className="app__loginContainer">
        <Button variant="contained" onClick={() => setOpenSignIn(true)} sx = {{marginBottom: 2, marginLeft: 2}} disableElevation>Sign In</Button>
        <Button variant="contained" onClick={() => setOpen(true)} sx = {{marginBottom: 2, marginLeft: 2}} disableElevation>Sign Up</Button>
        </div>
      )}
      </div>
      <div className="app__posts">
      {/*posts*/}
      <center>
      {posts.map(({id, post}) => (
        <Posts key={id} user={user} postId={id} imageUrl={post.imageUrl} username={post.username} caption={post.caption}/>
      ))}
      </center>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <center>
        <h3 style={{color: 'white', fontSize: 30}}>Sign In to Post</h3>
        </center>
      )}
    </div>
  );
}

export default App;
