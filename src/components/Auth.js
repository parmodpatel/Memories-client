import { useState } from "react";
import memories from "../images/memories.png";
import Login from "./Login";
import Signup from "./Signup";

const Auth = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";

  return (
    <main className="auth-shell">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-8">
        <section className="auth-visual hidden min-h-[560px] overflow-hidden p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-white/95 shadow-lg">
              <img src={memories} alt="Memories" className="h-11 w-11 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-100">Memories</p>
              <h1 className="mt-1 text-4xl font-bold tracking-normal text-white">
                Keep your moments close.
              </h1>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
              <p className="text-sm text-teal-50/75">Today</p>
              <p className="mt-1 text-2xl font-bold">Morning chai</p>
              <div className="mt-4 h-2 rounded-full bg-white/15">
                <div className="h-2 w-2/3 rounded-full bg-amber-300" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-amber-300 p-4 text-slate-950 transition hover:-translate-y-1">
                <p className="text-sm font-semibold">Weekend</p>
                <p className="mt-6 text-xl font-bold">Hills</p>
              </div>
              <div className="rounded-lg bg-rose-300 p-4 text-slate-950 transition hover:-translate-y-1">
                <p className="text-sm font-semibold">Family</p>
                <p className="mt-6 text-xl font-bold">Dinner</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card p-5 pt-7 sm:p-7 sm:pt-9">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-100">
              <img src={memories} alt="Memories" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-700">Memories</p>
              <h1 className="text-xl font-bold text-slate-950">Welcome</h1>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-slate-100 p-1.5 shadow-inner shadow-slate-200/80">
            <div className="flex gap-1">
              <button
                type="button"
                className={`auth-tab ${isLogin ? "auth-tab-active" : "auth-tab-idle"}`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-tab ${!isLogin ? "auth-tab-active" : "auth-tab-idle"}`}
                onClick={() => setMode("signup")}
              >
                Signup
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-teal-700">
              {isLogin ? "Good to see you again" : "Create your account"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {isLogin ? "Sign in to Memories" : "Start saving memories"}
            </h2>
          </div>

          {isLogin ? (
            <Login onLogin={onAuth} onSwitch={() => setMode("signup")} />
          ) : (
            <Signup onSignup={onAuth} onSwitch={() => setMode("login")} />
          )}
        </section>
      </div>
    </main>
  );
};

export default Auth;
