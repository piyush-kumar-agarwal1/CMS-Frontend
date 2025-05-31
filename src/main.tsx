import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import './styles/responsive.css';
import './styles/mobile.css';

createRoot(document.getElementById("root")!).render(<App />);
