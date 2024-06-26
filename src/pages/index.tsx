// pages/index.tsx
import React from 'react';
import EntradasTable from '@/components/EntradasTable';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col mx-20 p-4">
      <EntradasTable />
    </div>
  );
};

export default Home;
