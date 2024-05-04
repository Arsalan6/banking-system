import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import './App.css';
import Login from "./pages/login";
import Registration from "./pages/registration";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./pages/dashboard";
import Layout from "./layout/layout";


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
        <Route path="/dashboard" element={<Layout/>}>
        <Route
          path=""
          element={<Dashboard />}
        />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;