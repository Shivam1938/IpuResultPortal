import { useEffect, useState } from "react";
import AuthCard from "./components/AuthCard.jsx";
import ForgotPasswordCard from "./components/ForgotPasswordCard.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { IconGraduationCap } from "./components/icons.jsx";

const STORAGE_KEY = "ivy.session";

export default function App() {
  const [session, setSession] = useState(null);
  const [authView, setAuthView] = useState("login"); // "login" | "forgot"

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleAuthenticated = (next) => {
    setSession(next);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleLogout = () => {
    setSession(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <header className="no-print sticky top-0 z-10 border-b border-ink-800 bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pulse/10 text-pulse ring-1 ring-pulse/30">
              <IconGraduationCap width="17" height="17" />
            </div>
            <span className="text-sm font-bold tracking-tight text-neutral-100">IpuResultPortal</span>
          </div>
          {session && (
            <button onClick={handleLogout} className="btn-ghost !py-2 !text-xs">
              Sign out
            </button>
          )}
        </div>
      </header>

      <main className="flex-1">
        {session ? (
          <Dashboard authCookie={session.authCookie} onLogout={handleLogout} />
        ) : authView === "forgot" ? (
          <ForgotPasswordCard onBack={() => setAuthView("login")} />
        ) : (
          <AuthCard onAuthenticated={handleAuthenticated} onForgotPassword={() => setAuthView("forgot")} />
        )}
      </main>
    </div>
  );
}