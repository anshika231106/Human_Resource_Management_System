import { useState } from "react";
import { SignUpPage, SignInPage, loadSession, clearSession, type AuthUser } from "./modules/auth";
import { DashboardPage } from "./modules/dashboard";

type View = "signup" | "signin" | "dashboard";

function App() {
  const existingSession = loadSession();
  const [currentView, setCurrentView] = useState<View>(existingSession ? "dashboard" : "signin");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(existingSession?.user ?? null);

  const handleSignInSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setCurrentView("signin");
  };

  return (
    <div>
      {currentView === "signup" && (
        <SignUpPage onNavigateToSignIn={() => setCurrentView("signin")} />
      )}
      {currentView === "signin" && (
        <SignInPage
          onNavigateToSignUp={() => setCurrentView("signup")}
          onSignInSuccess={handleSignInSuccess}
        />
      )}
      {currentView === "dashboard" && currentUser && (
        <DashboardPage onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
