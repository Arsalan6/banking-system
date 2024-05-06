import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import './App.css';
import Login from "./pages/login";
import Registration from "./pages/registration";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./pages/dashboard";
import Layout from "./layout/layout";
import ProtectedRoute from "./config/protectedRoute";
import NewAccount from "./pages/new-account";
import EditProfilePage from "./pages/edit-profile";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";


function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route
            exact
            path="forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="reset-password"
            element={<ResetPassword />}
          />

        <Route exact path="/" element={<ProtectedRoute />}>
          <Route exact path="/" element={<Layout />}>
            <Route
              exact
              path="dashboard"
              element={<Dashboard />}
            />
            <Route
              exact
              path="new-account"
              element={<NewAccount />}
            />
            <Route
              exact
              path="edit-profile"
              element={<EditProfilePage />}
            />
          </Route>
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;