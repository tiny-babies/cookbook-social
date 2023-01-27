import React, { useState } from "react";
import HomePage from "./pages/HomePage.js";
import ProfilePage from "./pages/ProfilePage.js";

import { Route, Routes } from "react-router-dom";
import Navbars from "./components/navbars/Navbars.jsx";

function App() {
  return (
    <>
      {/* We import the navbars component here because we want it to be used on the whole app */}
      <Navbars />
      <Routes>
        <Route exact path="/home" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
