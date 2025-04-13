import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type DataRow = Record<string, any>;

/**
 * Converts an array of objects into table columns and rows.
 */
function parseTableData(data: DataRow[]): { headers: string[]; rows: any[][] } {
  if (!data || data.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((header) => row[header]));

  return { headers, rows };
}

/**
 * Generates a jsPDF instance with an autoTable based on the input data.
 */
export function generatePdf(data: DataRow[], title: string = "Report"): jsPDF {
  const doc = new jsPDF();
  const { headers, rows } = parseTableData(data);

  // Optional: Add a title to the document
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Create the table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [52, 73, 94] }, // dark gray
  });

  return doc;
}

/**
 * Generates and immediately downloads the PDF file.
 */
export function downloadPdf(
  data: DataRow[],
  fileName: string = "report.pdf",
  title?: string
) {
  const doc = generatePdf(data, title);
  doc.save(fileName);
}
