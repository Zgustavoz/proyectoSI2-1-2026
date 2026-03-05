import { Trash2 } from 'lucide-react';
import Btn from './Btn';

const DeleteButton = ({ onClick, disabled }) => (
  <Btn
    onClick={onClick}
    disabled={disabled}
    title={disabled ? 'Sin permiso' : 'Eliminar'}
    ariaLabel="Eliminar"
    hoverColor="bg-red-50 hover:text-red-600 hover:bg-red-100"
  >
    <Trash2 size={16} />
  </Btn>
);

export default DeleteButton;