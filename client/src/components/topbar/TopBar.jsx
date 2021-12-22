import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./topbar.css";
import { UserContext } from "../../App";
import Loader from "react-loader-spinner";

export default function TopBar() {
  const history = useHistory()

  const { state, dispatch } = useContext(UserContext)

  const [loader, setLoader] = useState(false)

  const handleLogout = () => {
    setLoader(true)
    setTimeout(() => {
      setLoader(false)
      localStorage.clear()
      dispatch({type: 'LOGOUT'})
      history.push('/')
    }, 2000)
  } 

  return (
    <>
    
    {loader && <div className='loaderLogin'>
        <div>
          <Loader
            type="Circles"
            color="#fff"
            height={100}
            w idth={100}
            timeout={2000} //3 secs
          />
        </div>

      </div>}
    
    <div className="top">
      <div className="topLeft">
        <i className="topIcon fab fa-facebook-square"></i>
        <i className="topIcon fab fa-twitter-square"></i>
        <i className="topIcon fab fa-pinterest-square"></i>
        <i className="topIcon fab fa-instagram-square"></i>
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/">
              HOME
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/">
              ABOUT
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/">
              CONTACT
            </Link>
          </li>
          {state && <li className="topListItem">
            <Link className="link" to="/write">
              WRITE
            </Link>
          </li>}
          {state && <li className="topListItem" onClick={handleLogout}>
             LOGOUT
          </li>}
        </ul>
      </div>
      <div className="topRight">
        {state ? (
          <Link to="/settings">
            <img className="topImg" src={state.avatar} alt="" />
          </Link>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/login">
                LOGIN
              </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/register">
                REGISTER
              </Link>
            </li>
          </ul>
        )}
        <i className="topSearchIcon fas fa-search"></i>
      </div>
    </div>
    </>
  );
}
