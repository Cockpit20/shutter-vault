import { useEffect, useState } from 'react';
import './App.css';
import Post from './Components/Post';
import { auth, db } from './firebaseConfig'; // Adjust the path as necessary
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Input, Button, Modal } from '@mui/material';
import { onAuthStateChanged, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import ImageUpload from './Components/ImageUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // useEffect -> Runs a piece of code based on a specific condition

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unSubscribe();
  }, [username, openSignIn]);

  useEffect(() => {
    // Reference to the 'posts' collection
    const postsCollection = collection(db, 'posts');

    const postsQuery = query(postsCollection, orderBy('timestamp', 'desc'));
    // Real-time listener for the 'posts' collection
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        const user = authUser.user;
        updateProfile(user, {
          displayName: username,
        }).then(() => {
          console.log('Profile updated successfully');
        }).catch((error) => {
          console.error('Error updating profile', error);
        });
        // Handle successful sign-up
        setUsername("")
        setPassword("")
        setEmail("")
        console.log('User signed up:', user);
      })
      .catch((error) => {
        // Handle sign-up errors
        alert(error.message);
      });
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password).catch((error) => alert(error.message))
    setPassword("")
    setEmail("")
    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className='app__modal' style={style} >
          <form className='app__signup'>
            <center>
              <img
                className="app__headerImage"
                src="https://shuttervaultpro.com/wp-content/uploads/2019/06/SVP-LOGO-FINAL-1.jpg"
                alt=""
              />
            </center>
            <Input
              className='app__input'
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className='app__input'
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className='app__input'
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit' className='app__button' onClick={signUp}>Sign Up</button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div className='app__modal' style={style} >
          <form className='app__signup'>
            <center>
              <img
                className="app__headerImage"
                src="https://shuttervaultpro.com/wp-content/uploads/2019/06/SVP-LOGO-FINAL-1.jpg"
                alt=""
              />
            </center>
            <Input
              className='app__input'
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className='app__input'
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit' className='app__button' onClick={signIn}>Sign In</button>
          </form>
        </div>
      </Modal>
      {/* <h1>HELLO Clever Programmers Let's Build an Instagram Clone with React!</h1> */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://shuttervaultpro.com/wp-content/uploads/2019/06/SVP-LOGO-FINAL-1.jpg"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className='app__loginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>

        )}
      </div>

      <div className='app__posts'>
        <div>
          {posts.map(({ id, post }) => {
            return <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageURL={post.imageURL}
            />
          })}
        </div>
      </div>


      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Login to Upload Photos</h3>
      )}
    </div>
  );
}

export default App;
