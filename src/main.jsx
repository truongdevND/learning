import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './routers';
import './index.css'; 
import 'antd/dist/reset.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);