import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ── Helpers ───────────────────────────────────────────────────
const getFecha = () => new Date().toLocaleDateString('es-BO', {
  year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

const getFilas = (data, columns) =>
  data.map(row => columns.map(col => row[col.key] ?? '—'));

const getHeaders = (columns) => columns.map(col => col.label);


// ── PDF ───────────────────────────────────────────────────────
export const exportToPDF = ({ data, columns, title, description }) => {
  const doc = new jsPDF();
  const fecha = getFecha();

  // Título
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 20);

  // Descripción
  if (description) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(description, 14, 28);
  }

  // Fecha
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(`Generado: ${fecha}`, 14, description ? 35 : 28);

  // Tabla
  autoTable(doc, {
    head: [getHeaders(columns)],
    body: getFilas(data, columns),
    startY: description ? 40 : 33,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${title.toLowerCase().replace(/ /g, '_')}.pdf`);
};


// ── Excel ─────────────────────────────────────────────────────
export const exportToExcel = ({ data, columns, title, description }) => {
  const fecha = getFecha();
  const wb = XLSX.utils.book_new();

  // Filas con descripción y fecha arriba
  const filas = [
    [title],
    description ? [description] : [],
    [`Generado: ${fecha}`],
    [],
    getHeaders(columns),
    ...getFilas(data, columns),
  ].filter(f => f.length > 0);

  const ws = XLSX.utils.aoa_to_sheet(filas);

  // Ancho de columnas automático
  ws['!cols'] = columns.map(() => ({ wch: 20 }));

  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/ /g, '_')}.xlsx`);
};


// ── HTML ──────────────────────────────────────────────────────
export const exportToHTML = ({ data, columns, title, description }) => {
  const fecha = getFecha();
  const headers = getHeaders(columns);
  const filas = getFilas(data, columns);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .desc { color: #666; font-size: 13px; margin-bottom: 4px; }
    .fecha { color: #999; font-size: 11px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #000; color: #fff; padding: 10px 12px; text-align: left; }
    td { padding: 9px 12px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) td { background: #f9f9f9; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${description ? `<p class="desc">${description}</p>` : ''}
  <p class="fecha">Generado: ${fecha}</p>
  <table>
    <thead>
      <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${filas.map(fila =>
        `<tr>${fila.map(cel => `<td>${cel}</td>`).join('')}</tr>`
      ).join('')}
    </tbody>
  </table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.toLowerCase().replace(/ /g, '_')}.html`;
  a.click();
  URL.revokeObjectURL(url);
};