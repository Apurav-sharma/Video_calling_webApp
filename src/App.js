import './App.css';
import { Routes, Route } from "react-router-dom";
import Lobby from './screens/lobby';
import Room from './screens/room_page';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Lobby />} />
        <Route path='/:roomID' element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
