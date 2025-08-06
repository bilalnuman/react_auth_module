import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import OtpPage from './features/auth/pages/OtpPage';
import Products from './Products';
import UploadFile from './UploadFile';
import Chatbot from './features/chatbot/Chatbot';

const App: React.FC = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/dataTableWidget" element={<Products />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/file-uploader" element={<UploadFile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/otp" element={<OtpPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
