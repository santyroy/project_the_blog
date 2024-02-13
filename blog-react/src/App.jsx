import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AddBlog from "./pages/AddBlog";
import { useState } from "react";
import Signup from "./pages/Signup";
import BlogDetail from "./components/BlogDetail";
import BlogEdit from "./pages/BlogEdit";
import PrivateRoutes from "./util/PrivateRoutes";
import BlogList from "./pages/BlogList";
import Home from "./pages/Home";
import SignupOTP from "./pages/SignupOTP";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Profile";

function App() {
  const [user, setUser] = useState({
    userId: "",
    email: "",
    exp: "",
    role: "",
    login: false,
  });

  return (
    <main className="container">
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<Signup setUser={setUser} />} />
        <Route path="signupOTP" element={<SignupOTP user={user} />} />
        <Route path="login" element={<Login user={user} setUser={setUser} />} />
        <Route path="forgotPassword" element={<ForgotPassword />} />
        <Route path="resetPassword" element={<ResetPassword />} />

        <Route element={<PrivateRoutes user={user} setUser={setUser} />}>
          <Route path="blogs" element={<BlogList user={user} />}>
            <Route path="add" element={<AddBlog userId={user.userId} />} />
          </Route>
          <Route path="blogs/:id" element={<BlogDetail />} />
          <Route path="blogs/:id/edit" element={<BlogEdit />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route
            path="profile/:id"
            element={<Settings user={user} setUser={setUser} />}
          />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
