import { useNavigate } from "react-router-dom";

const BackButton = ({ children = "Volver", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-block bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition ${className}`}
    >
      {children}
    </button>
  );
};

export default BackButton
