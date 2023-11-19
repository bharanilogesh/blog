import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Posts from "./Components/Posts";
import Detail from './Components/Detail';
import Create from "./Components/Create";
import Login from "./Components/Login";
import SignUp from "./Components/signUp";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="home" element={<Posts />} />
                <Route path="/read/:id" element={<Detail />} />
                <Route path="newblog" element={<Create />} />
                <Route path="/" element={<Login />} />
                <Route path="signup" element={<SignUp />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App;
