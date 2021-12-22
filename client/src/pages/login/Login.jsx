import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "./login.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../../App";
import Loader from "react-loader-spinner";

export default function Login() {

  const history = useHistory()
  
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loader, setLoader] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setLoader(true)

    fetch('auth/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    .then(res => res.json())
    .then(data => {
        if(data.error){
          setLoader(true)

          console.log(data, 'error');

          setTimeout(()=> {
            toast.error(data.error, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
            });
            setLoader(false)
          }, 2000)
        }
        else{
          console.log(data, 'success');
          
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          
          setTimeout(() => {
            toast.success(data.message, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
            });
            dispatch({type: 'USER', payload: data.user})
            history.push('/')
            setLoader(false)
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
      });
    })
  };

  return (
    <div className="login">
      {loader && <div className='loaderLogin'>
        <div>
          <Loader
            type="Circles"
            color="#fff"
            height={100}
            width={100}
            timeout={2000} //3 secs
          />
        </div>

      </div>}
 
        <span className="loginTitle">Login</span>
          <form className="loginForm" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              className="loginInput"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              className="loginInput"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="loginButton" type="button" onClick={handleSubmit}>
              Login
            </button>
          </form>
          <Link className="link" to="/register">
            <button className="loginRegisterButton">Register</button>
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
