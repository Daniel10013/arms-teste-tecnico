import { jsPDF } from 'jspdf';

export function downloadPDF(title: string, content: string) {
  const doc = new jsPDF();

  // Define o título
  doc.setFontSize(16);
  doc.text(title, 10, 20);

  doc.setFontSize(12);
  const linhas = doc.splitTextToSize(content, 180);
  doc.text(linhas, 10, 30);

  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  doc.save(`${slug}.pdf`);
}
