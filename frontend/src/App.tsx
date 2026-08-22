import { useState } from "react";
import { SignUpPage, SignInPage } from "./modules/auth";
import { DashboardPage } from "./modules/dashboard";

type View = "signup" | "signin" | "dashboard";

function App() {
  const [currentView, setCurrentView] = useState<View>("signin");

  return (
    <div>
      {currentView === "signup" && (
        <SignUpPage onNavigateToSignIn={() => setCurrentView("signin")} />
      )}
      {currentView === "signin" && (
        <SignInPage
          onNavigateToSignUp={() => setCurrentView("signup")}
          onSignInSuccess={() => setCurrentView("dashboard")}
        />
      )}
      {currentView === "dashboard" && (
        <DashboardPage onLogout={() => setCurrentView("signin")} />
      )}
    </div>
  );
}

export default App;
