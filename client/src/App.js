
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot from './pages/Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
