import "./App.css";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import LoggedOut from "./pages/LoggedOut";

function App() {
  const { user } = useAuth();

  return user ? <Home /> : <LoggedOut />;
}

export default App;
