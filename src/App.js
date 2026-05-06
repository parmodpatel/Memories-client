import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { getPosts } from "./actions/posts";
import Auth from "./components/Auth";
import Form from "./components/Form";
import Posts from "./components/Posts";
import { fetchMe, signOut } from "./api";
import memories from "./images/memories.png";
import "./index.css";

const App = () => {
  const [currentId, setCurrentId] = useState(null);
  const [auth, setAuth] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState("");
  const dispatch = useDispatch();

  const isAuthed = Boolean(auth?.user);
  const user = useMemo(() => auth?.user || null, [auth]);
  const displayName = user?.name || user?.email || "User";

  useEffect(() => {
    let isMounted = true;
    const fallbackTimer = window.setTimeout(() => {
      if (isMounted) {
        setAuth(null);
        setIsLoadingAuth(false);
      }
    }, 7000);

    const loadSession = async () => {
      try {
        const { data } = await fetchMe();
        if (isMounted) {
          setAuth({ user: data });
        }
      } catch (_error) {
        if (isMounted) {
          setAuth(null);
        }
      } finally {
        if (isMounted) {
          window.clearTimeout(fallbackTimer);
          setIsLoadingAuth(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      return;
    }

    const loadPosts = async () => {
      setPostsLoading(true);
      setPostsError("");
      try {
        await dispatch(getPosts());
      } catch (error) {
        setPostsError(
          error?.response?.data?.message || "Unable to load memories."
        );
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, [currentId, dispatch, isAuthed]);

  const handleLogin = (nextAuth) => {
    setAuth({ user: nextAuth.user });
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (_error) {
      // Logout still clears the UI session even if the server call fails.
    }

    setAuth(null);
  };

  if (isLoadingAuth) {
    return (
      <main className="auth-shell grid place-items-center px-4">
        <div className="auth-card px-5 py-4 text-sm font-semibold text-slate-600">
          Checking your session...
        </div>
      </main>
    );
  }

  if (!isAuthed) {
    return <Auth onAuth={handleLogin} />;
  }

  return (
    <main className="app-shell">
      <div className="page-wrap">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg border border-teal-300/20 bg-teal-300/10">
              <img src={memories} alt="Memories" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-white">
                Memories
              </h1>
              <p className="text-sm text-zinc-400">
                Signed in as{" "}
                <span className="font-medium text-teal-200">{displayName}</span>
              </p>
            </div>
          </div>

          <button className="btn-secondary w-full sm:w-auto" onClick={handleLogout}>
            Log out
          </button>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Posts
            isLoading={postsLoading}
            error={postsError}
            setCurrentId={setCurrentId}
            user={user}
          />

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <Form currentId={currentId} setCurrentId={setCurrentId} user={user} />
          </aside>
        </section>
      </div>
    </main>
  );
};

export default App;
