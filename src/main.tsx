import React from 'react';
import { createRoot } from 'react-dom/client';
import VoidGame from './game/VoidCourier.tsx'; // This grabs your main game file safely

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <VoidGame />
    </React.StrictMode>
  );
}