import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./register.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";

export default function Register() {

  const history = useHistory()

  const [loader, setLoader] = useState(false)

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line   
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      toast.error('Invalid Email Address', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return
    }
    
    setLoader(true)

    fetch('auth/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password,
        gender
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.error){
        console.log(data, 'error');
        setTimeout(() => {
          toast.error(data.error, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
          });
          setLoader(false)
        }, 2000)
      }
      else{
        console.log(data, 'success')
        toast.success(data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          setLoader(false)
          history.push('/login')
        }, 2000)
      }
    })
    .catch(err => {
      toast.error(err, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      })
    })
  }

  return (
    <div className="register">
      
       {loader && <div className='loaderLogin'>
        <div>
          <Loader
            type="Circles"
            color="#fff"
            height={100}
            width={100}
            timeout={5000} //3 secs
          />
        </div>

      </div>}

      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          className="registerInput"
          value={username}
          placeholder="Enter your username..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Email</label>
        <input
          type="text"
          className="registerInput"
          value={email}
          placeholder="Enter your email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          className="registerInput"
          placeholder="Enter your password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Gender</label>
        <select className='registerInput' defaultValue='Choose the gender' onChange={(e) => setGender(e.target.value)}>
          <option disabled value='Choose the gender'>Choose the gender</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
        <button className="registerButton" type="button" onClick={handleSubmit}>
          Register
        </button>
      </form>
      <Link className="link" to="/login">
        <button className="registerLoginButton">Login</button>
      </Link>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        />
    </div>
  );
}
