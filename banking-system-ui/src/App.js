import {BrowserRouter,Route,Routes} from "react-router-dom";

import './App.css';
import Login from "./pages/login";
import Registration from "./pages/registration";


function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/registration" element={<Registration/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;