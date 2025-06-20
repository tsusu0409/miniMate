import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import Player from './pages/Player';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/player" element={<Player />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;