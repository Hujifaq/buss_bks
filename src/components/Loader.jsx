import React from 'react';
import { SyncLoader } from 'react-spinners';

function Loader({ fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-4 pb-20"
    : "flex flex-col items-center justify-center w-full min-h-screen gap-4 pb-50";

  return (
    <div className={containerClasses}>
      <img src="https://apywlcxidcnpbqmectgn.supabase.co/storage/v1/object/sign/Public/logo_bks.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YTVlNjRlNS1mODdhLTRmMjMtODA1OC1mNTNiYWJmYzk5ODciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWJsaWMvbG9nb19ia3MucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NjY5NzI2NywiZXhwIjoxODE4MjMzMjY3fQ.1tkzGXAK-jzrfqokXBzQvV03VpKZ8VUpqQT6WQc6xps" alt='BKS_LOGO' className="w-32 h-auto object-contain" />  
      <SyncLoader color="#ff7a00" speedMultiplier={1.2} margin={5} size={15} />
    </div>
  );
}

export default Loader;
