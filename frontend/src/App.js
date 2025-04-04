import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Dashboard />} />
        <Route component={NotFound} /> {}
      </Routes>
    </Router>
  );
}

export default App;
