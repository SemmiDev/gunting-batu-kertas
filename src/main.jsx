import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App, { PlayGame, History } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/play' element={<PlayGame />} />
            <Route path='/history' element={<History />} />
        </Routes>
    </BrowserRouter>
);
