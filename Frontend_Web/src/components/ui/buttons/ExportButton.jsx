import { generarExcel, generarHTML, generarPDF } from '../../../utils/index';
import { useState, useRef, useEffect } from 'react';
import { Download, FileText, Sheet, Code } from 'lucide-react';

const ExportButton = ({ empresa, titulo, metadata, secciones }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const opciones = [
    {
      label: 'Exportar PDF',
      icon: FileText,
      color: 'text-red-600',
      bg: 'hover:bg-red-50',
      action: () => generarPDF({ empresa, titulo, metadata, secciones, nombreArchivo: `${titulo}.pdf` }),
    },
    {
      label: 'Exportar Excel',
      icon: Sheet,
      color: 'text-green-600',
      bg: 'hover:bg-green-50',
      action: () => generarExcel({ empresa, titulo, metadata, secciones, nombreArchivo: `${titulo}.xlsx` }),
    },
    {
      label: 'Exportar HTML',
      icon: Code,
      color: 'text-blue-600',
      bg: 'hover:bg-blue-50',
      action: () => generarHTML({ empresa, titulo, metadata, secciones, nombreArchivo: `${titulo}.html` }),
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
      >
        <Download size={16} />
        Exportar
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {opciones.map(({ label, icon: Icon, color, bg, action }) => (
            <button
              key={label}
              type="button"
              onClick={() => { action(); setOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${color} ${bg} transition`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportButton;