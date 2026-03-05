import { Eye, EyeOff } from 'lucide-react';
import Btn from './Btn';

const EstadoButton = ({ onClick, disabled, isActive }) => (
  <Btn
    onClick={onClick}
    disabled={disabled}
    title={disabled ? 'Sin permiso' : isActive ? 'Desactivar' : 'Activar'}
    ariaLabel={isActive ? 'Desactivar' : 'Activar'}
    hoverColor="bg-blue-50 hover:text-blue-600 hover:bg-blue-100"
  >
    {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
  </Btn>
);

export default EstadoButton;