import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./components/HomePage";
import CategoryPage from "./components/CategoryPage";
import GamePage from "./components/GamePage";
import StatsPage from "./components/StatsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/game/:categoryId/:gameMode" element={<GamePage />} />
          <Route path="/stats/:categoryId" element={<StatsPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;