import { Pencil } from 'lucide-react';
import Btn from './Btn';

const EditButton = ({ onClick, disabled }) => (
  <Btn
    onClick={onClick}
    disabled={disabled}
    title={disabled ? 'Sin permiso' : 'Editar'}
    ariaLabel="Editar"
    hoverColor="bg-amber-50 hover:text-amber-600 hover:bg-amber-100"
  >
    <Pencil size={16} />
  </Btn>
);

export default EditButton;