import { useSelector } from "react-redux";
import emptyFolder from "../images/empty-folder.png";
import Post from "./Post";

const Posts = ({ error, isLoading, setCurrentId, user }) => {
  const posts = useSelector((state) => state.posts);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-amber-200">Your board</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Saved memories</h2>
        </div>
        <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300">
          {posts.length} {posts.length === 1 ? "memory" : "memories"}
        </span>
      </div>

      {error && <div className="mb-4 error-text">{error}</div>}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div className="panel-soft h-72 animate-pulse" key={item} />
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="panel-soft grid place-items-center px-6 py-12 text-center">
          <img
            src={emptyFolder}
            alt="No memories"
            className="mb-5 h-28 w-28 object-contain opacity-80"
          />
          <h3 className="text-lg font-semibold text-white">No memories yet</h3>
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              setCurrentId={setCurrentId}
              user={user}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Posts;
