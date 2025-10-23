import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import type { Project } from './types';

// The problematic font utility is no longer imported.

// --- Interfaces ---
interface FixedItem {
  description: string;
  price: number;
}

interface EntityDetails {
  name: string;
  address: string;
  city: string;
  zip: string;
  ico: string;
}

interface InvoiceModalProps {
  project: Project;
  hourlyRate: number;
  timeCost: number;
  onClose: () => void;
}

// --- Helper Functions ---
const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const formatDate = (date: Date) => date.toLocaleDateString('cs-CZ');

// --- Component ---
const InvoiceModal: React.FC<InvoiceModalProps> = ({ project, hourlyRate, timeCost, onClose }) => {
  // --- State ---
  const [fixedItems, setFixedItems] = useState<FixedItem[]>([]);
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [bankAccount, setBankAccount] = useState('193788710/0600');
  
  const [provider, setProvider] = useState<EntityDetails>(() => {
    const saved = localStorage.getItem('providerDetails_v2');
    return saved ? JSON.parse(saved) : { name: 'Lukáš Rypl', address: 'Karlíkova 402', city: 'Rokycany', zip: '337 01', ico: 'Vaše IČO' };
  });
  const [customer, setCustomer] = useState<EntityDetails>({ name: '', address: '', city: '', zip: '', ico: '' });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('providerDetails_v2', JSON.stringify(provider));
  }, [provider]);

  // --- Handlers ---
  const handleAddItem = () => {
    const price = parseFloat(itemPrice);
    if (itemDescription && !isNaN(price) && price > 0) {
      setFixedItems([...fixedItems, { description: itemDescription, price }]);
      setItemDescription('');
      setItemPrice('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setFixedItems(fixedItems.filter((_, i) => i !== index));
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvider({ ...provider, [e.target.name]: e.target.value });
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // --- PDF Generation ---
  const generateInvoice = async () => {
    const fixedItemsTotal = fixedItems.reduce((sum, item) => sum + item.price, 0);
    const grandTotal = timeCost + fixedItemsTotal;

    try {
      const doc = new jsPDF();

      // 1. Fetch the font file and convert it to Base64
      try {
        const fontResponse = await fetch('/roboto/static/Roboto-Regular.ttf');
        if (!fontResponse.ok) throw new Error('Font file not found on server.');
        const fontBuffer = await fontResponse.arrayBuffer();
        
        // Convert ArrayBuffer to Base64 string
        const fontBase64 = btoa(
            new Uint8Array(fontBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');
      } catch (fontError) {
        console.error("Error loading custom font, proceeding with default font:", fontError);
        alert("Chyba: Nepodařilo se načíst font pro diakritiku. Faktura bude vygenerována bez něj.");
      }

      // 2. Add Logo
      try {
        const response = await fetch('/logo.png');
        const blob = await response.blob();
        const reader = new FileReader();
        const logoDataUrl = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        
        const logoWidth = 50;
        const logoHeight = 12.5;
        const pageWidth = doc.internal.pageSize.getWidth();
        const x = (pageWidth - logoWidth) / 2;
        doc.addImage(logoDataUrl, 'PNG', x, 15, logoWidth, logoHeight);
      } catch (error) {
        console.error("Could not load or add logo:", error);
      }
      
      let currentY = 50;

      // 3. Header
      doc.setFontSize(26);
      doc.text('Faktura', 14, currentY);
      currentY += 8;
      doc.setFontSize(12);
      doc.text(`Číslo: ${new Date().getFullYear()}${String(project.id).slice(-4)}`, 14, currentY);
      currentY += 10;

      // 4. Provider & Customer Details
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + 14);

      autoTable(doc, {
        startY: currentY,
        body: [
          [{ content: 'Dodavatel:', styles: { fontStyle: 'normal' } }, { content: 'Odběratel:', styles: { fontStyle: 'normal' } }],
          [`${provider.name}\n${provider.address}\n${provider.zip} ${provider.city}\nIČO: ${provider.ico}`, `${customer.name}\n${customer.address}\n${customer.zip} ${customer.city}\nIČO: ${customer.ico}`],
        ],
        theme: 'plain',
        styles: { font: 'Roboto', fontSize: 10 },
        columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } },
      });
      currentY = (doc as any).lastAutoTable.finalY + 5;
      
      autoTable(doc, {
        startY: currentY,
        body: [['Datum vystavení:', formatDate(today)], ['Datum splatnosti:', formatDate(dueDate)]],
        theme: 'plain',
        styles: { font: 'Roboto', fontSize: 10 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;

      // 5. Items Table
      doc.setFontSize(14);
      doc.text("Položky faktury", 14, currentY);
      currentY += 5;
      autoTable(doc, {
        startY: currentY,
        head: [['Popis', 'Množství', 'Sazba', 'Cena Kč']],
        body: [
          [`Práce na projektu: ${project.name}`, formatTime(project.totalSeconds), `${hourlyRate} Kč/hod`, `${timeCost.toFixed(2)}`],
          ...fixedItems.map(item => [item.description, '1', `${item.price.toFixed(2)}`, `${item.price.toFixed(2)}`]),
        ],
        foot: [['Celkem k úhradě', '', '', `${grandTotal.toFixed(2)} Kč`]],
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68], font: 'Roboto' },
        bodyStyles: { font: 'Roboto' },
        footStyles: { fillColor: [41, 41, 46], textColor: [255, 255, 255], fontStyle: 'normal', font: 'Roboto' },
        didParseCell: (data) => { data.cell.styles.font = 'Roboto'; }
      });
      currentY = (doc as any).lastAutoTable.finalY;

      // 6. Payment Information & QR Code
      doc.setFontSize(12);
      doc.text('Platební údaje:', 14, currentY + 15);
      doc.setFontSize(10);
      doc.text(`Číslo účtu: ${bankAccount}`, 14, currentY + 22);
      
      const spdString = `SPD*1.0*ACC:${bankAccount}*AM:${grandTotal.toFixed(2)}*MSG:FA-${new Date().getFullYear()}${String(project.id).slice(-4)}`;
      const qrCodeDataUrl = await QRCode.toDataURL(spdString, { errorCorrectionLevel: 'M' });
      doc.addImage(qrCodeDataUrl, 'PNG', 150, currentY + 10, 45, 45);

      // 7. Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text('Děkuji za Vaši platbu.', 14, pageHeight - 15);
            doc.text('Nejsem plátce DPH.', 14, pageHeight - 10);
      
            doc.save(`faktura-${project.name.replace(/\s/g, '_')}.pdf`);
            onClose();
          } catch (error) {      console.error("Chyba při generování PDF:", error);
      alert("Nepodařilo se vygenerovat PDF. Zkontrolujte konzoli pro více detailů.");
    }
  };

  // --- Render ---
  const renderEntityInputs = (entity: EntityDetails, handler: (e: React.ChangeEvent<HTMLInputElement>) => void, title: string) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 border-b border-zinc-700 pb-1">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <input name="name" value={entity.name} onChange={handler} placeholder="Jméno / Název firmy" className="bg-zinc-700 p-2 rounded" />
        <input name="ico" value={entity.ico} onChange={handler} placeholder="IČO" className="bg-zinc-700 p-2 rounded" />
        <input name="address" value={entity.address} onChange={handler} placeholder="Ulice a č.p." className="bg-zinc-700 p-2 rounded" />
        <input name="city" value={entity.city} onChange={handler} placeholder="Město" className="bg-zinc-700 p-2 rounded" />
        <input name="zip" value={entity.zip} onChange={handler} placeholder="PSČ" className="bg-zinc-700 p-2 rounded" />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-zinc-800 text-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Vytvořit Fakturu pro: {project.name}</h2>
        
        {renderEntityInputs(provider, handleProviderChange, 'Vaše údaje (Dodavatel)')}
        {renderEntityInputs(customer, handleCustomerChange, 'Údaje odběratele')}

        <h3 className="text-lg font-semibold mb-2 border-b border-zinc-700 pb-1">Fixní položky</h3>
        <div className="grid grid-cols-3 gap-4 mb-4 items-end">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Popis položky</label>
            <input type="text" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="např. Hosting 2025" className="w-full bg-zinc-700 p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cena (Kč)</label>
            <input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="1500" className="w-full bg-zinc-700 p-2 rounded" />
          </div>
        </div>
        <button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mb-6">Přidat fixní položku</button>

        <div className="bg-zinc-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Přehled faktury</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Práce dle času:</span> <span>{timeCost.toFixed(2)} Kč</span></div>
            {fixedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{item.description}</span>
                <div className="flex items-center gap-4">
                  <span>{item.price.toFixed(2)} Kč</span>
                  <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-400 text-xs">Odebrat</button>
                </div>
              </div>
            ))}
            <hr className="border-zinc-600" />
            <div className="flex justify-between font-bold text-xl">
              <span>CELKEM:</span>
              <span>{(timeCost + fixedItems.reduce((sum, item) => sum + item.price, 0)).toFixed(2)} Kč</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Číslo účtu pro platbu</label>
            <input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full bg-zinc-700 p-2 rounded" />
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button onClick={onClose} className="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded">Zrušit</button>
          <button onClick={generateInvoice} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded">Generovat PDF</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;