import React from 'react';
import { SyncLoader } from 'react-spinners';

function Loader({ fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-4 pb-20"
    : "flex flex-col items-center justify-center w-full min-h-screen gap-4 pb-50";

  return (
    <div className={containerClasses}>
      <img src="/src/assets/logo_bks.png" alt='BKS_LOGO' className="w-32 h-auto object-contain" />  
      <SyncLoader color="#ff7a00" speedMultiplier={1.2} margin={5} size={15} />
    </div>
  );
}

export default Loader;
