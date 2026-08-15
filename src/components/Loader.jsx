import React from 'react';
import { SyncLoader } from 'react-spinners';

function Loader({ fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-1 pb-20"
    : "flex flex-col items-center justify-center w-full min-h-screen gap-4 pb-30";

  return (
    <div className={containerClasses}>
      <img src="https://apywlcxidcnpbqmectgn.supabase.co/storage/v1/object/sign/Public/mae%20gram.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YTVlNjRlNS1mODdhLTRmMjMtODA1OC1mNTNiYWJmYzk5ODciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWJsaWMvbWFlIGdyYW0ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NjgwMTE3NywiZXhwIjoxODE4MzM3MTc3fQ.kXxTNJbi8aptL5mKUH0SrAPzxhw6xAdWZcE0zH1IdS4" alt='BKS_LOGO' className="w-70 h-auto object-contain" />  
      <SyncLoader color="#ff7a00" speedMultiplier={1.2} margin={5} size={21} />
    </div>
  );
}

export default Loader;
