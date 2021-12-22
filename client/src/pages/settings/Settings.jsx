import "./settings.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from '../../App'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom'
import Loader from "react-loader-spinner";

export default function Settings() {
  const history = useHistory()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loader, setLoader] = useState(false)

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    if(state){
      setUsername(state.username)
      setEmail(state.email)
      console.log(state._id);
    }
  }, [state])

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`user/update/${state._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.error){
        console.log(data, 'error');
        toast.error(data.error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
      }
      else{
        console.log(data, 'success');

        setLoader(true)

        localStorage.setItem('user', JSON.stringify(data.user))
        
        setTimeout(() => {
          dispatch({type: 'USER', payload: data.user})
          toast.success(data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
          setPassword('')
          setLoader(false)
        }, 2000)
      }
    })
    .catch(err => {
      toast.error('Something Wrong', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    })
  };

  const handleDelete = (e) => {
    e.preventDefault();

    fetch(`user/delete/${state._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        _id: state._id
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.error){
        console.log(data, 'error');

        toast.error(data.error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
      }
      else{
        console.log(data, 'success');
        
        setLoader(true)
        
        localStorage.clear()
        
        setTimeout(() => {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          dispatch({type: 'LOGOUT'})
          history.push('/')
          setLoader(false)
        }, 2000);
      }
    })
    .catch(err => {
      toast.error('Something Wrong', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    })
  }

  return (
    <div className="settings">
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
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <button type='button' className="settingsDeleteTitle" onClick={handleDelete}>Delete Account</button>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            {state && <img src={state.avatar} alt=""/>}
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder='Enter Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder='Enter Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
         
        </form>
      </div>
      <Sidebar />
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
