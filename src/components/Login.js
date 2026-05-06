import { useMemo, useState } from "react";
import { signIn } from "../api";

const Login = ({ onLogin, onSwitch }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailLooksValid = useMemo(() => {
    const email = form.email.trim();
    return email.length > 3 && email.includes("@") && email.includes(".");
  }, [form.email]);

  const passwordLooksValid = useMemo(
    () => form.password.length >= 8,
    [form.password]
  );

  const canSubmit = emailLooksValid && passwordLooksValid && !isSubmitting;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (!emailLooksValid) {
      setError("Enter a valid email address.");
      return;
    }

    if (!passwordLooksValid) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await signIn({
        email: form.email.trim(),
        password: form.password,
      });
      setForm({ email: "", password: "" });
      onLogin({ user: data.user });
    } catch (err) {
      setForm((prev) => ({ ...prev, password: "" }));
      setError(err.response?.data?.message || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="auth-field"
            placeholder="you@example.com"
            autoComplete="email"
          />
          {touched.email && !emailLooksValid && (
            <p className="auth-hint text-rose-600">Please enter a valid email.</p>
          )}
        </div>

        <div>
          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <div className="auth-input-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="auth-field pr-20"
              placeholder="Enter your password"
              autoComplete="current-password"
              maxLength={128}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {touched.password && !passwordLooksValid && (
            <p className="auth-hint text-rose-600">Use at least 8 characters.</p>
          )}
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={!canSubmit} className="auth-primary w-full">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
        <span>New here?</span>
        <button
          type="button"
          onClick={onSwitch}
          className="ml-2 font-bold text-teal-700 transition hover:text-teal-900"
        >
          Create an account
        </button>
      </div>
    </>
  );
};

export default Login;
