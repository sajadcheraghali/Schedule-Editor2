// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import DndProviderWrapper from "./components/DndProviderWrapper";
import ExportPage from "./export/page"; // صفحه نمایش JSON

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* Header */}
        <header className="py-3 text-center bg-light">
          <h2 className="mb-0">Schedule Editor</h2>
        </header>

        {/* Main Content */}
        <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-white">
          <div className="container-fluid px-4">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">
                <Routes>
                  <Route path="/Schedule-Editor2" element={<DndProviderWrapper />} />
                  <Route path="/export" element={<ExportPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
