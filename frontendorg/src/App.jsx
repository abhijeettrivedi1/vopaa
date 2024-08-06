import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/Index';
import Layout from './Layout';
import axios from 'axios';
import RegisterPage from './pages/Register';
import LoginPage from './pages/LoginPage';
import { Usercontextprovider } from './usercontext';
import TestPage from './pages/TestPage';
import StudentPage from './pages/StudentsPage';
import CreateStudent from './pages/CreateStudent';
import CreateTestPage from './pages/CreateTest';
import ProtectedRoute from './ProtectedRoute.jsx';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Usercontextprovider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/test/:id"
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createstudent"
            element={
              <ProtectedRoute>
                <CreateStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createtest"
            element={
              <ProtectedRoute>
                <CreateTestPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Usercontextprovider>
    </>
  );
}

export default App;
