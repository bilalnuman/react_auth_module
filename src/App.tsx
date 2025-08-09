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
import SearchInputDebounce from './features/searchInput/Filter';
import { Charts } from './features/charts';
import Sidebar from './features/sidebar/sidebar';

const App: React.FC = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><Products /></div>
          </div>
        } />
        <Route path="/charts" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><Charts /></div>
          </div>
        } />
        <Route path="/users" element={<div>
          <div>
            <Sidebar />
            <h2>All users</h2>
          </div>
        </div>} />
        <Route path="/users/add" element={<div>
          <div>
            <Sidebar />
            <h2>Add users</h2>
          </div>
        </div>} />


        <Route path="/dataTableWidget" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><Products /></div>
          </div>
        } />
        <Route path="/searchInput" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><SearchInputDebounce /></div>
          </div>
        } />
        <Route path="/chatbot" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><Chatbot /></div>
          </div>
        } />
        <Route path="/file-uploader" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><UploadFile /></div>
          </div>
        } />
        <Route path="/login" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><LoginPage /></div>
          </div>
        } />
        <Route path="/register" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><RegisterPage /></div>
          </div>
        } />
        <Route path="/forgot-password" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><ForgotPasswordPage /></div>
          </div>
        } />
        <Route path="/reset-password" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><ResetPasswordPage /></div>
          </div>
        } />
        <Route path="/otp" element={
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'><OtpPage /></div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
