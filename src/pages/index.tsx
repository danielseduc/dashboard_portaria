// pages/index.tsx
import React from 'react';
import DentroObra from '../components/DentroObra';

const Home: React.FC = () => {
  return (
    <div style={{ marginTop: '20px',  display: 'flex', justifyContent: 'center', alignItems: 'baseline', height: '100vh' }}>
      <DentroObra />
    </div>
  );
};

export default Home;
