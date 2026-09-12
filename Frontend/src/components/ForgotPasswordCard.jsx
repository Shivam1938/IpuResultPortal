import { useEffect, useState, useCallback } from "react";
import { fetchCaptcha, forgotPassword } from "../api/client.js";
import {
  IconGraduationCap,
  IconMail,
  IconRefresh,
  IconAlert,
  IconCheckCircle,
  IconArrowLeft,
} from "./icons.jsx";

export default function ForgotPasswordCard({ onBack }) {
  const [captcha, setCaptcha] = useState({ imageUrl: "", jSessionId: "" });
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({ username: "", uemail: "", captchaText: "" });

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
    setSuccessMessage("");

    if (!form.username || !form.uemail || !form.captchaText) {
      setError("Fill in your enrollment number, registered email and the captcha to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await forgotPassword({
        username: form.username.trim(),
        uemail: form.uemail.trim(),
        captchaText: form.captchaText.trim(),
        jSessionId: captcha.jSessionId,
      });

      if (!result?.success) {
        throw new Error(result?.message || "Couldn't send the reset link. Please try again.");
      }

      setSuccessMessage(result.message || "Email sent successfully to the registered email id.");
      setForm({ username: "", uemail: "", captchaText: "" });
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
          <h1 className="text-2xl font-bold tracking-tight">Password Recovery</h1>
          <p className="mt-2 max-w-xs text-sm text-neutral-400">
            Enter your enrollment number and registered email to receive a password reset link from the GGSIPU exam portal.
          </p>
        </div>

        <div className="panel p-6 sm:p-8">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <IconAlert className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                <IconCheckCircle />
              </div>
              <p className="text-sm text-neutral-200">{successMessage}</p>
              <button type="button" onClick={onBack} className="btn-primary w-full">
                <IconArrowLeft width="16" height="16" />
                Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="field-label" htmlFor="fp-username">
                  Enrollment number
                </label>
                <input
                  id="fp-username"
                  className="field"
                  placeholder="e.g. 01127902723"
                  autoComplete="username"
                  value={form.username}
                  onChange={update("username")}
                />
              </div>

              <div className="mb-4">
                <label className="field-label" htmlFor="fp-uemail">
                  Registered email ID
                </label>
                <input
                  id="fp-uemail"
                  type="email"
                  className="field"
                  placeholder="e.g. name@example.com"
                  autoComplete="email"
                  value={form.uemail}
                  onChange={update("uemail")}
                />
              </div>

              <div className="mb-6">
                <label className="field-label" htmlFor="fp-captchaText">
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
                  id="fp-captchaText"
                  className="field"
                  placeholder="Type the characters shown above"
                  autoComplete="off"
                  value={form.captchaText}
                  onChange={update("captchaText")}
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={submitting || captchaLoading}>
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/40 border-t-ink-950" />
                    Sending…
                  </>
                ) : (
                  <>
                    <IconMail />
                    Send reset link
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-200"
              >
                <IconArrowLeft width="13" height="13" />
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}