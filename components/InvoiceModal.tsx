import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Project } from './types';

interface FixedItem {
  description: string;
  price: number;
}

interface InvoiceModalProps {
  project: Project;
  hourlyRate: number;
  timeCost: number;
  onClose: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const InvoiceModal: React.FC<InvoiceModalProps> = ({ project, hourlyRate, timeCost, onClose }) => {
  const [fixedItems, setFixedItems] = useState<FixedItem[]>([]);
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');

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

  const fixedItemsTotal = fixedItems.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = timeCost + fixedItemsTotal;

  const generateInvoice = () => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(22);
      doc.text(`Faktura za projekt: ${project.name}`, 14, 22);
      doc.setFontSize(12);
      doc.text(`Datum generování: ${new Date().toLocaleDateString('cs-CZ')}`, 14, 32);

      // Summary Table
      doc.setFontSize(14);
      doc.text("Souhrn", 14, 50);
      doc.line(14, 52, 196, 52);
      autoTable(doc, {
        startY: 55,
        head: [['Položka', 'Množství', 'Sazba', 'Cena']],
        body: [
          ['Sledovaný čas', formatTime(project.totalSeconds), `${hourlyRate} Kč/hod`, `${timeCost.toFixed(2)} Kč`],
          ...fixedItems.map(item => [item.description, '1', `${item.price.toFixed(2)} Kč`, `${item.price.toFixed(2)} Kč`]),
        ],
        foot: [['Celkem', '', '', `${grandTotal.toFixed(2)} Kč`]],
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68] },
        footStyles: { fillColor: [41, 41, 46], textColor: [255, 255, 255], fontStyle: 'bold' },
      });

      // Time Entries Table
      if (project.timeEntries.length > 0) {
        const timeEntriesBody = project.timeEntries.map(entry => {
            const startDate = new Date(entry.start).toLocaleString('cs-CZ');
            const endDate = new Date(entry.end).toLocaleString('cs-CZ');
            const duration = formatTime((entry.end - entry.start) / 1000);
            return [startDate, endDate, duration, entry.note];
        });
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Začátek', 'Konec', 'Trvání', 'Poznámka']],
            body: timeEntriesBody,
            theme: 'grid',
            headStyles: { fillColor: [239, 68, 68] },
        });
      }

      doc.save(`faktura-${project.name.replace(/\s/g, '_')}.pdf`);
      onClose();
    } catch (error) {
      console.error("Chyba při generování PDF:", error);
      alert("Nepodařilo se vygenerovat PDF. Zkontrolujte konzoli pro více detailů.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-zinc-800 text-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Vytvořit Fakturu pro: {project.name}</h2>

        {/* Add Fixed Item Form */}
        <div className="grid grid-cols-3 gap-4 mb-4 items-end">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Popis položky</label>
            <input
              type="text"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="např. Hosting 2025"
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cena (Kč)</label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="1500"
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2"
            />
          </div>
        </div>
        <button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mb-6">
          Přidat fixní položku
        </button>

        {/* Summary */}
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
              <span>{grandTotal.toFixed(2)} Kč</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          <button onClick={onClose} className="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded">
            Zrušit
          </button>
          <button onClick={generateInvoice} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded">
            Generovat PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
