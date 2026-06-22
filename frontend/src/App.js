import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import BackgroundOrbs from "./components/BackgroundOrbs";
import ParticleBackground from "./components/ParticleBackground";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Practice from "./pages/Practice";
import MockTest from "./pages/MockTest";
import Consistency from "./pages/Consistency";
import NotFound from "./pages/NotFound";

const AppLayout = ({ children }) => (
  <div style={{ minHeight: "100vh", background: "#000", position: "relative" }}>
    <BackgroundOrbs />
    <ParticleBackground />
    <div style={{ position: "relative", zIndex: 10 }}>
      <Navbar />
      {children}
    </div>
  </div>
);

const PrivatePage = ({ children }) => (
  <PrivateRoute>
    <AppLayout>{children}</AppLayout>
  </PrivateRoute>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivatePage><Dashboard /></PrivatePage>} />
          <Route path="/roadmap" element={<PrivatePage><Roadmap /></PrivatePage>} />
          <Route path="/practice" element={<PrivatePage><Practice /></PrivatePage>} />
          <Route path="/mocktest" element={<PrivatePage><MockTest /></PrivatePage>} />
          <Route path="/consistency" element={<PrivatePage><Consistency /></PrivatePage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
