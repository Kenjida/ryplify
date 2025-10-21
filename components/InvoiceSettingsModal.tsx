import React, { useState, useEffect } from 'react';
import type { Project } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

interface InvoiceSettingsModalProps {
  project: Project | null;
  onClose: () => void;
  hourlyRate: number;
}

interface InvoiceData {
  supplierName: string;
  supplierAddress: string;
  supplierIC: string;
  supplierRegister: string;
  customerName: string;
  customerAddress: string;
  customerIC: string;
  invoiceNumber: string;
  dateOfIssue: string;
  bankAccount: string;
  variableSymbol: string;
}

const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const InvoiceSettingsModal: React.FC<InvoiceSettingsModalProps> = ({ project, onClose, hourlyRate }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    // Default Supplier Data - YOU CAN EDIT THIS
    supplierName: 'Lukáš Dvořák',
    supplierAddress: 'Vaše Adresa, Město, PSČ',
    supplierIC: 'Vaše IČO',
    supplierRegister: 'Živnostenský rejstřík vedený u MÚ...',
    // Customer and Invoice Data
    customerName: '',
    customerAddress: '',
    customerIC: '',
    invoiceNumber: `F${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,
    dateOfIssue: new Date().toISOString().split('T')[0],
    bankAccount: '193788710/0600',
    variableSymbol: new Date().getTime().toString().slice(-8),
  });
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill customer name from project name
    if (project) {
      setInvoiceData(prev => ({ ...prev, customerName: project.name }));
    }
    
    // Fetch and convert logo to base64
    fetch('/vibecoding_ryplify.png') // Make sure this path is correct
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogo(reader.result as string);
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => console.error("Error loading logo:", err));

  }, [project]);

  if (!project) return null;

  const totalCost = (project.totalSeconds / 3600) * hourlyRate;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const generatePdf = async () => {
    const doc = new jsPDF();

    // 1. Logo
    if (logo) {
      doc.addImage(logo, 'PNG', 14, 10, 60, 20); // Adjust position and size as needed
    }

    // 2. Title
    doc.setFontSize(22);
    doc.text('Faktura', 14, 45);
    doc.setFontSize(12);
    doc.text(invoiceData.invoiceNumber, 14, 52);

    // 3. Supplier and Customer Details
    doc.setFontSize(10);
    doc.text('Dodavatel (Vy):', 14, 65);
    doc.text(invoiceData.supplierName, 14, 70);
    doc.text(invoiceData.supplierAddress, 14, 75);
    doc.text(`IČ: ${invoiceData.supplierIC}`, 14, 80);
    doc.text(invoiceData.supplierRegister, 14, 85);

    doc.text('Odběratel (Zákazník):', 110, 65);
    doc.text(invoiceData.customerName, 110, 70);
    doc.text(invoiceData.customerAddress, 110, 75);
    doc.text(`IČ: ${invoiceData.customerIC}`, 110, 80);

    // 4. Invoice Dates
    doc.text(`Datum vystavení: ${new Date(invoiceData.dateOfIssue).toLocaleDateString('cs-CZ')}`, 14, 100);
    
    // 5. Time Entries Table (Předmět plnění)
    const tableBody = project.timeEntries.map(entry => {
        const startDate = new Date(entry.start).toLocaleString('cs-CZ');
        const endDate = new Date(entry.end).toLocaleString('cs-CZ');
        const duration = formatTime((entry.end - entry.start) / 1000);
        return [startDate, endDate, duration, entry.note];
    });
    autoTable(doc, {
        startY: 110,
        head: [['Začátek', 'Konec', 'Trvání', 'Poznámka']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
    });

    // 6. Summary Table
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Celkový čas', 'Hodinová sazba', 'Celková cena']],
        body: [[formatTime(project.totalSeconds), `${hourlyRate.toFixed(2)} Kč/hod`, `${totalCost.toFixed(2)} Kč`]],
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68] },
    });

    // 7. Payment Information and QR Code
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text('Platební údaje:', 14, finalY + 20);
    doc.setFontSize(10);
    doc.text(`Číslo účtu: ${invoiceData.bankAccount}`, 14, finalY + 26);
    doc.text(`Variabilní symbol: ${invoiceData.variableSymbol}`, 14, finalY + 31);
    doc.text(`Částka: ${totalCost.toFixed(2)} Kč`, 14, finalY + 36);

    // QR Code Generation
    try {
        // IMPORTANT: For this to work, you need the full IBAN. 
        // The format is CZ + 2 check digits + bank code (0600) + account number (padded to 16 digits).
        // Example: CZ6506000000000193788710 - PLEASE VERIFY YOUR IBAN
        const iban = 'CZ6506000000000193788710'; // REPLACE WITH YOUR CORRECT IBAN
        const qrString = `SPD*1.0*ACC:${iban}*AM:${totalCost.toFixed(2)}*CC:CZK*MSG:Platba faktury ${invoiceData.invoiceNumber}*X-VS:${invoiceData.variableSymbol}`;
        const qrCodeImage = await QRCode.toDataURL(qrString, { errorCorrectionLevel: 'M' });
        doc.addImage(qrCodeImage, 'PNG', 150, finalY + 15, 45, 45);
    } catch (err) {
        console.error('Failed to generate QR code', err);
    }

    doc.save(`faktura-${invoiceData.invoiceNumber}-${project.name.replace(/\s/g, '_')}.pdf`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-zinc-800 text-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Nastavení faktury pro: {project.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supplier Column */}
            <div className="space-y-4 p-4 bg-zinc-700 rounded-lg">
                <h3 className="text-lg font-semibold border-b border-zinc-600 pb-2">Dodavatel (Vy)</h3>
                <div>
                    <label className="text-sm text-gray-400">Jméno/Firma</label>
                    <input type="text" name="supplierName" value={invoiceData.supplierName} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Adresa</label>
                    <input type="text" name="supplierAddress" value={invoiceData.supplierAddress} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="text-sm text-gray-400">IČ</label>
                    <input type="text" name="supplierIC" value={invoiceData.supplierIC} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Zápis v rejstříku</label>
                    <input type="text" name="supplierRegister" value={invoiceData.supplierRegister} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
                </div>
            </div>

            {/* Customer Column */}
            <div className="space-y-4 p-4 bg-zinc-700 rounded-lg">
                <h3 className="text-lg font-semibold border-b border-zinc-600 pb-2">Odběratel (Zákazník)</h3>
                <div>
                    <label className="text-sm text-gray-400">Jméno/Firma</label>
                    <input type="text" name="customerName" value={invoiceData.customerName} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Adresa</label>
                    <input type="text" name="customerAddress" value={invoiceData.customerAddress} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="text-sm text-gray-400">IČ</label>
                    <input type="text" name="customerIC" value={invoiceData.customerIC} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
                </div>
            </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="p-4 bg-zinc-700 rounded-lg">
                <label className="text-sm text-gray-400">Číslo faktury</label>
                <input type="text" name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
            </div>
            <div className="p-4 bg-zinc-700 rounded-lg">
                <label className="text-sm text-gray-400">Datum vystavení</label>
                <input type="date" name="dateOfIssue" value={invoiceData.dateOfIssue} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
            </div>
            <div className="p-4 bg-zinc-700 rounded-lg">
                <label className="text-sm text-gray-400">Bankovní účet</label>
                <input type="text" name="bankAccount" value={invoiceData.bankAccount} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
            </div>
            <div className="p-4 bg-zinc-700 rounded-lg">
                <label className="text-sm text-gray-400">Variabilní symbol</label>
                <input type="text" name="variableSymbol" value={invoiceData.variableSymbol} onChange={handleInputChange} className="w-full bg-zinc-600 p-2 rounded mt-1"/>
            </div>
        </div>

        <div className="flex justify-end mt-8 space-x-3">
          <button onClick={onClose} className="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded">
            Zrušit
          </button>
          <button onClick={generatePdf} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded">
            Vygenerovat PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSettingsModal;
