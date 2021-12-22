import React, { useEffect, createContext, useContext, useReducer } from 'react'
import { BrowserRouter ,Route, useHistory } from "react-router-dom";
import Home from "./pages/home/Home";
import TopBar from "./components/topbar/TopBar";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import Settings from "./pages/settings/Settings";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { reducer, initialState } from './reducers/userReducer';

export const UserContext = createContext()

const Routing = () => {

  const history = useHistory()

  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({type: 'USER', payload: user})

      const url = window.location.pathname.split('/')
      
      if(url[url.length - 1] === 'login'){
        history.push('/')
      }   
      if(url[url.length - 1] === 'register'){
        history.push('/')
      }
    }
    else{
      history.push('/')
    }
    // eslint-disable-next-line
  }, [])

  return(
      <>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/register">
          <Register />
        </Route>
        
        <Route path="/login">
          <Login />
        </Route>

        <Route path="/write"> 
          <Write />
        </Route>
        
        <Route path="/settings">
          <Settings />
        </Route>
        
        <Route path="/post/:postId">
          <Single />
        </Route>
      </>
  )
}

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>

      <BrowserRouter>

        <TopBar />
      
        <Routing />

      </BrowserRouter>

    </UserContext.Provider>
  );
}

export default App;
