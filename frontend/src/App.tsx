import { useState } from "react";
import { SignUpPage, SignInPage } from "./modules/auth";

function App() {
  const [currentView, setCurrentView] = useState<"signup" | "signin">("signin");

  return (
    <div>
      {currentView === "signup" ? (
        <SignUpPage onNavigateToSignIn={() => setCurrentView("signin")} />
      ) : (
        <SignInPage onNavigateToSignUp={() => setCurrentView("signup")} />
      )}
    </div>
  );
}

export default App;
