import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import CreateArticle from './pages/CreateArticles/CreateArticles';
import Navigation from './components/Navigation/Navigation';

import "./App.css";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gerar-artigo" element={<CreateArticle />} />
      </Routes>
    </Router>
  );
}

export default App;
