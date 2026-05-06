import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost, updatePost } from "../actions/posts";
import { getCloudinarySignature } from "../api";

const emptyPost = {
  title: "",
  message: "",
  tags: "",
  selectedFile: "",
  imageUrl: "",
  imagePublicId: "",
};

const Form = ({ currentId, setCurrentId, user }) => {
  const [postData, setPostData] = useState(emptyPost);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const post = useSelector((state) =>
    currentId ? state.posts.find((item) => item._id === currentId) : null
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setPostData({
        ...emptyPost,
        ...post,
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
      });
    }
  }, [post]);

  const normalizeTags = (tagsValue) => {
    if (Array.isArray(tagsValue)) {
      return tagsValue;
    }

    return tagsValue
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const titleReady = postData.title.trim().length > 0;
  const messageReady = postData.message.trim().length > 0;
  const canSubmit = useMemo(
    () => titleReady && messageReady && !uploading && !isSaving,
    [isSaving, messageReady, titleReady, uploading]
  );

  const resetForm = () => {
    setCurrentId(null);
    setPostData(emptyPost);
    setSubmitError("");
    setUploadError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setSubmitError("Title and message are required.");
      return;
    }

    const payload = {
      ...postData,
      tags: normalizeTags(postData.tags),
    };

    setIsSaving(true);
    setSubmitError("");

    try {
      if (currentId) {
        await dispatch(updatePost(currentId, payload));
      } else {
        await dispatch(createNewPost(payload));
      }
      resetForm();
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message || "Unable to save this memory."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const signatureResponse = await getCloudinarySignature();
      const { cloudName, apiKey, timestamp, signature } =
        signatureResponse?.data || {};

      if (!cloudName || !apiKey || !timestamp || !signature) {
        throw new Error("Cloudinary signature unavailable.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData?.error?.message || "Upload failed.");
      }

      setPostData((prev) => ({
        ...prev,
        imageUrl: uploadData?.secure_url || "",
        imagePublicId: uploadData?.public_id || "",
        selectedFile: "",
      }));
    } catch (error) {
      setUploadError(error?.message || "Unable to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="dash-form-card p-5 pt-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-teal-700">
            {currentId ? "Edit memory" : "New memory"}
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-950">
            {currentId ? "Refine the details" : "Capture a moment"}
          </h2>
        </div>
        {currentId && (
          <button type="button" className="dash-secondary" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <p className="mb-4 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
        Posting as{" "}
        <span className="font-bold text-slate-900">{user?.name || user?.email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="dash-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="dash-field bg-slate-100"
            value={postData.title}
            onChange={(event) =>
              setPostData({ ...postData, title: event.target.value })
            }
            maxLength={120}
            placeholder="Weekend in the hills"
          />
        </div>

        <div>
          <label className="dash-label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="dash-field min-h-32 resize-y bg-slate-100"
            value={postData.message}
            onChange={(event) =>
              setPostData({ ...postData, message: event.target.value })
            }
            maxLength={2000}
            placeholder="Write what made it worth remembering"
          />
        </div>

        <div>
          <label className="dash-label" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            className="dash-field bg-slate-100"
            value={postData.tags}
            onChange={(event) =>
              setPostData({ ...postData, tags: event.target.value })
            }
            placeholder="travel, family, food"
          />
        </div>

        <div>
          <label className="dash-label" htmlFor="image">
            Image
          </label>
          <div className="dash-upload bg-slate-100">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="bg-slate-100 w-full text-sm font-semibold text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-teal-700"
            />
          </div>
          {uploading && <p className="dash-hint text-teal-700">Uploading image...</p>}
          {uploadError && <p className="dash-hint text-rose-600">{uploadError}</p>}
        </div>

        {postData.imageUrl && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
            <img
              src={postData.imageUrl}
              alt="Preview"
              className="h-44 w-full rounded-md object-cover"
            />
          </div>
        )}

        {submitError && <div className="dash-error">{submitError}</div>}

        <button type="submit" disabled={!canSubmit} className="dash-primary w-full">
          {isSaving ? "Saving..." : currentId ? "Update memory" : "Create memory"}
        </button>
      </form>
    </section>
  );
};

export default Form;
