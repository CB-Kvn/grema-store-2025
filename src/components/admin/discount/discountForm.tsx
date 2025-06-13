import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const discountTypes = [
  { value: "PERCENTAGE", label: "Porcentaje" },
  { value: "FIXED", label: "Fijo" },
  { value: "BUY_X_GET_Y", label: "Lleva X y paga Y" },
];

export function DiscountForm({ onAdd }: { onAdd: (discount: any) => void }) {
  const [form, setForm] = useState({
    type: "PERCENTAGE",
    value: "",
    startDate: "",
    endDate: "",
    isActive: true,
    minQuantity: "",
    maxQuantity: "",
    items: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.value || !form.startDate) return;
    onAdd({
      ...form,
      value: parseFloat(form.value),
      minQuantity: form.minQuantity ? parseInt(form.minQuantity) : undefined,
      maxQuantity: form.maxQuantity ? parseInt(form.maxQuantity) : undefined,
      items: form.items
        ? form.items
            .split(",")
            .map((i) => parseInt(i.trim()))
            .filter((i) => !isNaN(i))
        : [],
      startDate: form.startDate,
      endDate: form.endDate || null,
    });
    setForm({
      type: "PERCENTAGE",
      value: "",
      startDate: "",
      endDate: "",
      isActive: true,
      minQuantity: "",
      maxQuantity: "",
      items: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6 items-end">
      <div>
        <label className="block text-xs mb-1">Tipo de descuento</label>
        <select
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="border rounded px-2 py-1"
        >
          {discountTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1">Valor</label>
        <Input
          type="number"
          value={form.value}
          onChange={(e) => handleChange("value", e.target.value)}
          required
          className="w-24"
          placeholder="Ej: 10"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Fecha de inicio</label>
        <Input
          type="date"
          value={form.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Fecha de fin</label>
        <Input
          type="date"
          value={form.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Activo</label>
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          className="scale-125"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Cantidad mínima</label>
        <Input
          type="number"
          value={form.minQuantity}
          onChange={(e) => handleChange("minQuantity", e.target.value)}
          className="w-20"
          placeholder="Ej: 1"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Cantidad máxima</label>
        <Input
          type="number"
          value={form.maxQuantity}
          onChange={(e) => handleChange("maxQuantity", e.target.value)}
          className="w-20"
          placeholder="Ej: 10"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">IDs de ítems (separados por coma)</label>
        <Input
          type="text"
          value={form.items}
          onChange={(e) => handleChange("items", e.target.value)}
          placeholder="1,2,3"
          className="w-32"
        />
      </div>
      <Button type="submit" className="h-10">Agregar descuento</Button>
    </form>
  );
}