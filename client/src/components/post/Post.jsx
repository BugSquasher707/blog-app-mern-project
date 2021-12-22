import "./post.css";
import { Link } from "react-router-dom";

export default function Post({ post }) {

  return (
    <>
    <Link to={`/post/${post._id}`} className="link">
      <div className="post">
        <img className="postImg" src={post.pic} alt="" />
        <div className="postInfo">
            <span className="postTitle">{post.title}</span>        
          <hr />
          <span className="postDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        <p className="postDesc">{post.body}</p>
      </div>
    </Link>
    </>
  );
}
