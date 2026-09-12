import { useEffect, useState, useCallback } from "react";
import { fetchCaptcha, login } from "../api/client.js";
import { IconGraduationCap, IconLock, IconEye, IconEyeOff, IconRefresh, IconAlert } from "./icons.jsx";

export default function AuthCard({ onAuthenticated, onForgotPassword }) {
  const [captcha, setCaptcha] = useState({ imageUrl: "", jSessionId: "" });
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ username: "", password: "", captchaText: "" });

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setError("");
    try {
      const prev = captcha.imageUrl;
      const next = await fetchCaptcha();
      setCaptcha(next);
      if (prev) URL.revokeObjectURL(prev);
    } catch (err) {
      setError(err.message);
    } finally {
      setCaptchaLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password || !form.captchaText) {
      setError("Fill in your enrollment number, password and the captcha to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await login({
        username: form.username.trim(),
        password: form.password,
        captchaText: form.captchaText.trim(),
        jSessionId: captcha.jSessionId,
      });

      if (!result?.success || !result?.authCookie) {
        throw new Error(result?.message || "Login failed. Please try again.");
      }

      onAuthenticated({ authCookie: result.authCookie, username: form.username.trim() });
    } catch (err) {
      setError(err.message);
      setForm((f) => ({ ...f, captchaText: "" }));
      loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-grid-fade" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pulse/10 text-pulse ring-1 ring-pulse/30">
            <IconGraduationCap width="26" height="26" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">IpuResultPortal</h1>
          <p className="mt-2 max-w-xs text-sm text-neutral-400">
            Sign in with your GGSIPU enrollment number to view semester-wise results, SGPA and CGPA.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="panel p-6 sm:p-8">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <IconAlert className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="field-label" htmlFor="username">
              Enrollment number
            </label>
            <input
              id="username"
              className="field"
              placeholder="Enter Your Enrollment Number"
              autoComplete="username"
              value={form.username}
              onChange={update("username")}
            />
          </div>

          <div className="mb-4">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="field pr-11"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={form.password}
                onChange={update("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="field-label" htmlFor="captchaText">
              Captcha
            </label>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-[52px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-ink-600 bg-white">
                {captchaLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink-300 border-t-transparent" />
                ) : captcha.imageUrl ? (
                  <img src={captcha.imageUrl} alt="Captcha" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-xs text-ink-500">Unavailable</span>
                )}
              </div>
              <button
                type="button"
                onClick={loadCaptcha}
                className="btn-ghost !px-3"
                aria-label="Refresh captcha"
                disabled={captchaLoading}
              >
                <IconRefresh className={captchaLoading ? "animate-spin" : ""} />
              </button>
            </div>
            <input
              id="captchaText"
              className="field"
              placeholder="Type the characters shown above"
              autoComplete="off"
              value={form.captchaText}
              onChange={update("captchaText")}
            />
          </div>

          <div className="mb-6 -mt-3 flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-medium text-neutral-400 transition-colors hover:text-pulse"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting || captchaLoading}>
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/40 border-t-ink-950" />
                Signing in…
              </>
            ) : (
              <>
                <IconLock />
                Sign in
              </>
            )}
          </button>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-neutral-500">
            <IconLock width="13" height="13" />
            Your credentials go straight to the official GGSIPU exam portal.
          </p>
        </form>
      </div>
    </div>
  );
}