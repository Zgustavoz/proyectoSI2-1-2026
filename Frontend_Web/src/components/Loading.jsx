// src/components/Loading.jsx
export const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <svg className="animate-spin h-8 w-8 text-black" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  </div>
);
