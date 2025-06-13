
import { useEffect, useState } from "react";
import { DiscountForm } from "./discountForm";
import { DiscountsTable } from "./discountTable";


export function DiscountTab() {
 const [discounts, setDiscounts] = useState<any[]>([]);

 // Simulación de fetch
async function getAllDiscounts() {
  // Reemplaza por tu fetch real
  return [
    {
      id: 1,
      type: "PERCENTAGE",
      value: 10,
      startDate: "2024-06-12T00:00:00Z",
      endDate: "2024-07-12T00:00:00Z",
      isActive: true,
      minQuantity: 1,
      maxQuantity: 10,
      items: [1, 2, 3],
    },
    // ...otros descuentos
  ];
}

const handleSaveDiscount = (discount: any) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === discount.id ? discount : d))
    );
    // Aquí puedes llamar a tu API para guardar el descuento
  };

 useEffect(() => {

     getAllDiscounts().then(setDiscounts);
   }, []);

  return (
  <>
  <div className="bg-white rounded shadow p-6">
    <DiscountForm onAdd={nuevo => setDiscounts(prev => [
      ...prev,
      { ...nuevo, id: prev.length ? Math.max(...prev.map(d => d.id)) + 1 : 1 }
    ])} />
    <DiscountsTable discounts={discounts} onSave={handleSaveDiscount} />
  </div>
  </>
  );
}