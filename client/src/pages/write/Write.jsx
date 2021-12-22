import { useState, useEffect } from "react";
import "./write.css";
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";

export default function Write() {
  const history = useHistory()
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null)
  
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if(url){
      fetch('post/create', {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({

            title,
            body,
            pic: url

        }),
    })
    
    .then(response => response.json())
    .then(data => {
            if (data.error){
                console.log('error:', data);
                toast.error('Please fill all the missing fields', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            else
            {
                console.log('Success:', data);
                toast.success("Post created successfully", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                setTimeout(() => {
                    history.push('/')
                }, 2000);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            toast("Wow so easy!");
        });
    }
  // eslint-disable-next-line
  }, [url])

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoader(true)
    
    const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", "lms-vvork")
        data.append("cloud_name", "dq2s0p5ue")
        fetch("https://api.cloudinary.com/v1_1/dq2s0p5ue/image/upload", {
            method: "post",
            body: data
        })
        .then(res => res.json())
        .then(data => {
          setUrl(data.url)
          
          setTimeout(()=>{
            setLoader(false)
          }, 2000)
          
        })
        .catch(err => {
            console.log(err)
        })
  }

  return (
    <div className="write">

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

      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        
        <div className="writeFormGroup">
        <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="writeFormGroup">
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            onChange={e => setBody(e.target.value)}
          ></textarea>
        </div>
          <div className="writeFormGroup">

            <button className="writeSubmit" type="button" onClick={handleSubmit}>
            Publish
            </button>

          </div>
        
      </form>
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
