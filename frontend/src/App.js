import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <ErrorBoundary>
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;