import { Plus } from 'lucide-react';

const CreateButton = ({ onClick, label = 'Nuevo' }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
  >
    <Plus size={16} />
    {label}
  </button>
);

export default CreateButton;