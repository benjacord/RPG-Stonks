import { GameProvider } from './context/GameContext';
import { RPGLayout } from './components/Layout/RPGLayout';
import { MapGrid } from './components/Map/MapGrid';
import './index.css';         // Global RPG styles
// import './App.css'        // Removing default styles

function App() {
  return (
    <GameProvider>
      <RPGLayout>
        <MapGrid />
      </RPGLayout>
    </GameProvider>
  );
}

export default App;
