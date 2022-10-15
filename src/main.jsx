import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App.jsx';
import PlayGame from './components/PlayGame.jsx';
import History from './components/History.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            {/* ketika url nya /, maka kita render fungsi App */}
            <Route path='/' element={<App />} />
            {/* ketika url nya /play, maka kita render fungsi Play */}
            <Route path='/play' element={<PlayGame />} />
            {/* ketika url nya /history, maka kita render fungsi History */}
            <Route path='/history' element={<History />} />
        </Routes>
    </BrowserRouter>
);
