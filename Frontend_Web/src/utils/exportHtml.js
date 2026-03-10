const generarHTML = (config) => {
  const {
    empresa = 'MI EMPRESA',
    titulo = 'REPORTE',
    metadata = {},
    secciones = [],
    nombreArchivo = 'reporte.html',
  } = config;

  const fecha = new Date().toLocaleString('es-BO');

  const renderMetadata = () =>
    Object.entries(metadata)
      .map(([key, value]) => `<span><strong>${key}:</strong> ${value}</span>`)
      .join('');

  const renderSecciones = () =>
    secciones.map(({ titulo: tituloSeccion, columnas = [], datos = [], mapearDatos = null }) => {
      const datosProcesados = mapearDatos
        ? datos.map(mapearDatos)
        : datos.map(item =>
            columnas.map(col => {
              const clave = col.toLowerCase().replace(/ /g, '_');
              const valor = item[clave] ?? item[col] ?? '-';
              return typeof valor === 'boolean' ? (valor ? 'Activo' : 'Inactivo') : valor;
            })
          );

      return `
        <section>
          <h2>${tituloSeccion}</h2>
          <table>
            <thead>
              <tr>${columnas.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${datosProcesados.map(fila =>
                `<tr>${fila.map(cel => `<td>${cel}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </section>`;
    }).join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${titulo} — ${empresa}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; padding: 40px; color: #111; background: #fff; }
    header { border-bottom: 2px solid #000; padding-bottom: 16px; margin-bottom: 24px; }
    header h1 { font-size: 22px; }
    header h2 { font-size: 15px; font-weight: normal; color: #555; margin-top: 4px; }
    .meta { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 10px; font-size: 12px; color: #777; }
    section { margin-bottom: 36px; }
    section h2 { font-size: 14px; text-transform: uppercase; margin-bottom: 10px;
                 padding-bottom: 4px; border-bottom: 1px solid #ddd; color: #333; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #000; color: #fff; padding: 9px 12px; text-align: left; }
    td { padding: 8px 12px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) td { background: #f9f9f9; }
    footer { margin-top: 40px; font-size: 11px; color: #aaa; text-align: center; }
  </style>
</head>
<body>
  <header>
    <h1>${empresa}</h1>
    <h2>${titulo}</h2>
    <div class="meta">
      ${renderMetadata()}
      <span><strong>Generado:</strong> ${fecha}</span>
    </div>
  </header>

  ${renderSecciones()}

  <footer>Reporte generado automáticamente — ${fecha}</footer>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
};

export default generarHTML