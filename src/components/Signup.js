import { useMemo, useState } from "react";
import { signUp } from "../api";

const Signup = ({ onSignup, onSwitch }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const emailLooksValid = useMemo(() => {
    const email = form.email.trim();
    return email.length > 3 && email.includes("@") && email.includes(".");
  }, [form.email]);

  const passwordLooksValid = useMemo(
    () => form.password.length >= 8,
    [form.password]
  );
  const passwordsMatch = useMemo(
    () => form.password === form.confirmPassword && form.confirmPassword.length > 0,
    [form.password, form.confirmPassword]
  );

  const canSubmit =
    emailLooksValid && passwordLooksValid && passwordsMatch && !isSubmitting;

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
    setTouched({ email: true, password: true, confirmPassword: true });

    if (!emailLooksValid) {
      setError("Enter a valid email address.");
      return;
    }

    if (!passwordLooksValid) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      onSignup({ user: data.user });
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      setError(err.response?.data?.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="auth-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="auth-field"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

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
              placeholder="Create a password"
              autoComplete="new-password"
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

        <div>
          <label className="auth-label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <div className="auth-input-wrap">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="auth-field pr-20"
              placeholder="Re-enter your password"
              autoComplete="new-password"
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
          {touched.confirmPassword && !passwordsMatch && (
            <p className="auth-hint text-rose-600">Passwords must match.</p>
          )}
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={!canSubmit} className="auth-primary w-full">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
        <span>Already have an account?</span>
        <button
          type="button"
          onClick={onSwitch}
          className="ml-2 font-bold text-teal-700 transition hover:text-teal-900"
        >
          Sign in instead
        </button>
      </div>
    </>
  );
};

export default Signup;
