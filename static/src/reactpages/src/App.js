import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard"; 
import ClassBooking from "./pages/ClassBooking";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/member/dashboard" element={<Dashboard />} />
      <Route path="/member/sessions" element={<ClassBooking />} />
    </Routes>
  );
};

export default App;
