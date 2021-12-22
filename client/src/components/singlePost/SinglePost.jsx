import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./singlePost.css";
import { useHistory } from 'react-router-dom'
import { UserContext } from "../../App";
import Loader from "react-loader-spinner";

export default function SinglePost() {
  const location = useLocation();
  const history = useHistory()
  
  // eslint-disable-next-line
  const {state, dispatch} = useContext(UserContext)

  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const getPost = () => {
      fetch(`${path}`)
      .then(res => res.json())
      .then(data => {
        if(data.error){
          console.log(data, 'error');
        }
        else{
          console.log(data, 'success');
          setTimeout(()=>{
            setPost(data.post)
            setTitle(data.post.title)
            setDesc(data.post.body)
          },2000)
        }
      })
      .catch(err => {
        console.log(err)
      })
    };
    getPost();
  }, [path]);

  const handleDelete = () => {
    setLoader(true)
    fetch(`delete/${post._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        _id: post._id
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
        setTimeout(() => {
          setLoader(false)
        }, 2000)
      }
      else{
        console.log(data, 'success');
        
        toast.success(data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
        setTimeout(() => {
          setLoader(false)
          history.push('/')
        }, 2000)
      }
    })
    .catch(err => {
      toast.error('Something Wrong', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
  })
  };

  const handleUpdate = () => {
    setLoader(true)
    fetch(`update/${post._id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        title,
        body: desc
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
        setTimeout(() => {
          setLoader(false)
        }, 2000)
      }
      else{
        console.log(data, 'success');

        toast.success(data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          setLoader(false)
          setUpdateMode(false)
        }, 2000)
      }
    })
  };

  return (
    <>

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

     <div className="singlePost">
     {!post && <>
     <div className='loader'>
      <Loader
        type="Circles"
        color="#555"
        height={80}
        width={80}
        timeout={2000} //3 secs
      />
      </div>
    </>}
     {post && <div className="singlePostWrapper">
          <img src={post && post.pic} alt="" className="singlePostImg" />
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post && <>
              {state && <>
                {post.postedBy.username === state.username && <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>}
            </>}
            </>}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author: <b> {post && post.postedBy.username}</b>
          </span>
          <span className="singlePostDate">
            {post && new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        />
    </div>
    </>
  );
}
