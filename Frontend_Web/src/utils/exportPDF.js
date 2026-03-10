import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

class PDFGenerator {
  constructor(config = {}) {
    this.config = {
      empresa: {
        nombre: config.empresa || 'MI EMPRESA',
        colorPrimario: config.colorPrimario || [0, 0, 0],
      },
    };
    this.doc = null;
    this.yPos = 0;
  }

  inicializar(orientacion = 'portrait', formato = 'a4') {
    this.doc = new jsPDF({ orientation: orientacion, unit: 'mm', format: formato });
    this.yPos = 20;
    return this;
  }

  agregarEncabezado(subtitulo = '') {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(18);
    this.doc.text(this.config.empresa.nombre, 105, this.yPos, { align: 'center' });
    this.yPos += 10;

    if (subtitulo) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(14);
      this.doc.text(subtitulo, 105, this.yPos, { align: 'center' });
      this.yPos += 8;
    }

    this.doc.setDrawColor(...this.config.empresa.colorPrimario);
    this.doc.setLineWidth(0.5);
    this.doc.line(10, this.yPos, 200, this.yPos);
    this.yPos += 15;
    return this;
  }

  agregarMetadata(metadata = {}) {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80);

    Object.entries(metadata).forEach(([key, value], index) => {
      this.doc.text(`${key}: ${value}`, 15, this.yPos + index * 6);
    });

    this.yPos += Object.keys(metadata).length * 6 + 10;
    return this;
  }

  agregarSeccion(configSeccion) {
    const {
      titulo,
      tipo = 'tabla',
      datos = [],
      columnas = [],
      mapearDatos = null,
      color = this.config.empresa.colorPrimario,
      contenidoTexto = '',
      contenidoCustom = null,
      opcionesTabla = {},
    } = configSeccion;

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(30);
    this.doc.text(titulo.toUpperCase(), 15, this.yPos);
    this.yPos += 8;

    switch (tipo) {
      case 'tabla':
        this._agregarTabla(columnas, datos, mapearDatos, color, opcionesTabla);
        break;
      case 'texto':
        this._agregarTexto(contenidoTexto);
        break;
      case 'resumen':
        this._agregarResumen(datos);
        break;
      case 'custom':
        if (contenidoCustom) contenidoCustom(this.doc, this);
        break;
    }

    this.yPos += 10;
    return this;
  }

  _agregarTabla(columnas, datos, mapearDatos, color, opciones) {
    if (!datos || datos.length === 0) {
      this._agregarTexto('No hay datos disponibles');
      return;
    }

    const datosProcesados = mapearDatos
      ? datos.map(mapearDatos)
      : this._mapearDatosAutomatico(datos, columnas);

    autoTable(this.doc, {
      head: [columnas],
      body: datosProcesados,
      startY: this.yPos,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: color, textColor: 255, halign: 'center', fontSize: 9 },
      columnStyles: this._generarEstilosColumnas(columnas),
      ...opciones,
    });

    this.yPos = this.doc.lastAutoTable.finalY + 10;
  }

  _mapearDatosAutomatico(datos, columnas) {
    return datos.map(item =>
      columnas.map(columna => {
        const clave = columna.toLowerCase();
        const posiblesClaves = [
          clave,
          this._camelCase(clave),
          this._snakeCase(clave),
          this._quitarAcentos(clave),
          ...Object.keys(item).filter(
            key => key.toLowerCase().includes(clave) || clave.includes(key.toLowerCase())
          ),
        ];

        let valor = '-';
        for (const posibleClave of posiblesClaves) {
          if (item[posibleClave] !== undefined && item[posibleClave] !== null) {
            valor = item[posibleClave];
            break;
          }
        }
        return this._formatearValor(columna, valor);
      })
    );
  }

  _camelCase(texto) {
    return texto.replace(/([-_][a-z])/g, g => g.toUpperCase().replace('-', '').replace('_', ''));
  }

  _snakeCase(texto) {
    return texto.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  _quitarAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  _formatearValor(nombreColumna, valor) {
    const col = nombreColumna.toLowerCase();

    if (col.includes('total') || col.includes('precio') || col.includes('monto') ||
        col.includes('subtotal') || col.includes('descuento') || col.includes('importe')) {
      return `Bs. ${(parseFloat(valor) || 0).toFixed(2)}`;
    }

    if ((col.includes('fecha') || col.includes('date')) && valor) {
      try {
        if (typeof valor === 'string' && valor.match(/\d{4}-\d{2}-\d{2}/))
          return new Date(valor).toLocaleDateString('es-BO');
      } catch { return valor; }
    }

    if (col.includes('estado') && typeof valor === 'boolean')
      return valor ? 'Activo' : 'Inactivo';

    return valor !== undefined && valor !== null ? String(valor) : '-';
  }

  _generarEstilosColumnas(columnas) {
    const estilos = {};
    columnas.forEach((col, i) => {
      if (col.includes('TOTAL') || col.includes('PRECIO') || col.includes('MONTO'))
        estilos[i] = { halign: 'right', fontStyle: 'bold' };
      else if (col.includes('FECHA'))
        estilos[i] = { halign: 'center' };
      else if (col.includes('ESTADO') || col.includes('CANTIDAD') || col.includes('STOCK'))
        estilos[i] = { halign: 'center' };
      else
        estilos[i] = { halign: 'left' };
    });
    return estilos;
  }

  _agregarTexto(texto) {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80);
    const lineas = this.doc.splitTextToSize(texto, 180);
    lineas.forEach(linea => {
      this.doc.text(linea, 20, this.yPos);
      this.yPos += 5;
    });
  }

  _agregarResumen(items) {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    Object.entries(items).forEach(([label, value], index) => {
      this.doc.setTextColor(60);
      this.doc.text(`${label}:`, 20, this.yPos + index * 6);
      this.doc.setTextColor(30);
      this.doc.text(String(value), 80, this.yPos + index * 6);
    });
    this.yPos += Object.keys(items).length * 6 + 5;
  }

  agregarPiePagina() {
    const pageCount = this.doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(150);
      this.doc.text(
        `Página ${i} de ${pageCount} — Generado el ${new Date().toLocaleString('es-BO')}`,
        105, 290, { align: 'center' }
      );
    }
    return this;
  }

  generar(nombreArchivo = 'reporte.pdf', opcion = 'descargar') {
    this.agregarPiePagina();
    if (opcion === 'imprimir') {
      this.doc.autoPrint();
      window.open(this.doc.output('bloburl'));
    } else {
      this.doc.save(nombreArchivo);
    }
    return this.doc;
  }
}

const generarPDF = (config) => {
  const {
    empresa = 'MI EMPRESA',
    titulo = 'REPORTE',
    metadata = {},
    secciones = [],
    nombreArchivo = 'reporte.pdf',
    opcion = 'descargar',
  } = config;

  const generator = new PDFGenerator({ empresa });

  generator
    .inicializar()
    .agregarEncabezado(titulo)
    .agregarMetadata(metadata);

  secciones.forEach(seccion => generator.agregarSeccion(seccion));

  return generator.generar(nombreArchivo, opcion);
};

export default generarPDF