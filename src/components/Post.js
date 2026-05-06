import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../actions/posts";

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const Post = ({ post, setCurrentId, user }) => {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const dispatch = useDispatch();
  const isOwner =
    user?.id === post.creatorId ||
    (user?.email && (post.creatorEmail || post.creator) === user.email);
  const image = post.imageUrl || post.selectedFile;
  const createdAt = useMemo(() => formatDate(post.createdAt), [post.createdAt]);

  const handleLike = async () => {
    setError("");
    setIsLiking(true);
    try {
      await dispatch(likePost(post._id));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to like this memory.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);
    try {
      await dispatch(deletePost(post._id));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete this memory.");
      setIsDeleting(false);
    }
  };

  return (
    <article className="panel-soft overflow-hidden">
      {image ? (
        <img src={image} alt={post.title} className="h-56 w-full object-cover" />
      ) : (
        <div className="grid h-44 place-items-center bg-zinc-950/70">
          <span className="text-sm font-medium text-zinc-500">No image</span>
        </div>
      )}

      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags?.slice(0, 4).map((tag) => (
            <span className="chip" key={tag}>
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-6 text-white">{post.title}</h3>
          {createdAt && (
            <span className="shrink-0 text-xs font-medium text-zinc-500">
              {createdAt}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-4 text-sm leading-6 text-zinc-400">
          {post.message}
        </p>

        {error && <div className="mt-4 error-text">{error}</div>}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            className="btn-secondary min-h-9 px-3"
            onClick={handleLike}
            disabled={isLiking}
            type="button"
          >
            {isLiking ? "Liking..." : `Like ${post.likecount || 0}`}
          </button>

          {isOwner && (
            <>
              <button
                className="btn-secondary min-h-9 px-3"
                onClick={() => setCurrentId(post._id)}
                type="button"
              >
                Edit
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
                type="button"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default Post;
