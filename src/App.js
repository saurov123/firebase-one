import logo from './logo.svg';
import './App.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateCurrentUser } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
const auth=getAuth(app)

function App() {
  const [user,setUser]= useState({});
  const [email,setEmail]= useState('');
  const [name,setName]=useState('');
  const [password,setPassword]= useState('');
  const [validated, setValidated] = useState(false);
  const [registerd,setRegisterd]=useState(false);
  const [error,setError]= useState('');

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const handleGoogleSignIn =()=>{
    signInWithPopup(auth,googleProvider)
    .then(result=>{
      const user=result.user;
     setUser(user);
     console.log(user);
    })
    .catch(error=>{
      console.error(error)
    })
  } 

  const handleGithubSignIn = () =>{
    signInWithPopup(auth,githubProvider)
    .then(result=>{
      const user=result.user;
     setUser(user);
     console.log(user);
    })
    .catch(error=>{
      console.error(error)
    })
  }

  const handleGoogleSignOut = () => {
    signOut(auth)
    .then(()=>{
      setUser({});
    })
    .catch(error =>{
      setUser({});
    })
  }

  const handleEmail = event =>{
    setEmail(event.target.value)
  }

  const handlePassword = event =>{
    setPassword(event.target.value)
  }

  const handleRegisteredChange = event =>{
    setRegisterd(event.target.checked)
  }
 
  const handleName = event =>{
    setName(event.target.value)
  }
  const handleSubmit = event =>{
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if(!/(?=.*[!@#$%^&*])/.test(password)){
      setError('password should contain at least one special character.')
      return;
      
    }

    setValidated(true);
    setError('')

 if(registerd){
    signInWithEmailAndPassword(auth,email,password)
    .then(result=>{
      const user=result.user;
     setUser(user);
     console.log(user);
    })
    .catch(error=>{
      console.error(error);
      setError(error.message)
    })

 }

 else{
  createUserWithEmailAndPassword(auth,email,password)
  .then(result=>{
    const user=result.user;
   setUser(user);
   console.log(user);
   setEmail('');
   setPassword('');
   verifyEmail();
   setUserName();
  })
  .catch(error=>{
    console.error(error)
    setError(error.message)
  })
 }
 
    // console.log('submitted',email,password)
    event.preventDefault();
  }

const verifyEmail =()=>{
 sendEmailVerification(auth.currentUser)
 .then(()=>{
   console.log('email sent')
 })
}

const handleResetPassword =()=>{
  sendPasswordResetEmail(auth,email)
  .then(()=>{
    console.log('password reset email')
  })
  .catch((error)=>{
    console.error(error)
  })
}

const setUserName =()=>{
  updateCurrentUser(auth.currentUser, {
    displayName : name
  })
  .then(()=>{
    console.log('name update')
  })
}
  return (
    <div className="App">

  <div className='sign-in'>
  {
        user.uid ? <button onClick={handleGoogleSignOut}>sign out</button>: 
        <>
        <button onClick={handleGoogleSignIn}> <FcGoogle></FcGoogle> Google sign in</button>
        <button onClick={handleGithubSignIn}><FaGithub></FaGithub> Github sign in</button>
        </>
        
      }
        <h2>Name : {user.displayName}</h2>
       <h2>Email : {user.email}</h2>
        <img src={user.photoURL} alt=""></img>
 
  </div>
      
       
       
       


        <div className='registration-form w-50 mx-auto'>
     <h3 className='text-primary'>Please {registerd ? 'log in' : 'register'}!!!!</h3>    
    <Form noValidate validated={validated}  onSubmit={handleSubmit}>


    {!registerd &&<Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Your Name</Form.Label>
    <Form.Control onBlur={handleName} type="text" placeholder="Enter your name"  required/>
    <Form.Control.Feedback type="invalid">
      Please provide Your name.
    </Form.Control.Feedback>
    </Form.Group>}


    <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control onBlur={handleEmail} type="email" placeholder="Enter email"  required/>
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
    <Form.Control.Feedback type="invalid">
      Please provide a valid email.
    </Form.Control.Feedback>
    </Form.Group>


  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control onBlur={handlePassword} type="password" placeholder="Password" required />
    <Form.Control.Feedback type="invalid">
            Please provide a valid password.
    </Form.Control.Feedback>
  </Form.Group>

   <p className='text-danger'> {error}</p>
   <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered???" />
  </Form.Group>
  <Button onClick={handleResetPassword} variant="link">Forget Password ?</Button> <br/>
  <Button variant="primary" type="submit">
    {registerd ?  'log in' : 'register'}
  </Button>
</Form>
        
        </div>
    </div>
  );
}

export default App;
