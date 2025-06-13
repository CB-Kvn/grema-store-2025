import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// DiscountType puede ser un enum, aquí lo simulamos:
const discountTypes = ["PERCENTAGE", "FIXED"];

export function DiscountsTable({ discounts, onSave }: {
  discounts: any[];
  onSave: (discount: any) => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const startEdit = (d: any) => {
    setEditingId(d.id);
    setEditData({ ...d });
  };

  const handleChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editData);
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-xs">
        <thead>
          <tr className="bg-primary-100">
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Tipo</th>
            <th className="px-2 py-1 border">Valor</th>
            <th className="px-2 py-1 border">Fecha inicio</th>
            <th className="px-2 py-1 border">Fecha fin</th>
            <th className="px-2 py-1 border">Activo</th>
            <th className="px-2 py-1 border">Min. Cantidad</th>
            <th className="px-2 py-1 border">Max. Cantidad</th>
            <th className="px-2 py-1 border">Items</th>
            <th className="px-2 py-1 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <tr key={d.id}>
              <td className="border px-2">{d.id}</td>
              <td className="border px-2">
                {editingId === d.id ? (
                  <select
                    value={editData.type}
                    onChange={e => handleChange("type", e.target.value)}
                    className="border rounded px-1"
                  >
                    {discountTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  d.type
                )}
              </td>
              <td className="border px-2">
                {editingId === d.id ? (
                  <Input
                    type="number"
                    value={editData.value}
                    onChange={e => handleChange("value", parseFloat(e.target.value))}
                    className="w-16"
                  />
                ) : (
                  d.value
                )}
              </td>
              <td className="border px-2">
                {editingId === d.id ? (
                  <Input
                    type="date"
                    value={editData.startDate?.slice(0, 10)}
                    onChange={e => handleChange("startDate", e.target.value)}
                  />
                ) : (
                  d.startDate?.slice(0, 10)
                )}
              </td>
              <td className="border px-2">
                {editingId === d.id ? (
                  <Input
                    type="date"
                    value={editData.endDate?.slice(0, 10) || ""}
                    onChange={e => handleChange("endDate", e.target.value)}
                  />
                ) : (
                  d.endDate?.slice(0, 10) || "-"
                )}
              </td>
              <td className="border px-2">
                {editingId === d.id ? (
                  <input
                    type="checkbox"
                    checked={editData.isActive}
                    onChange={e => handleChange("isActive", e.target.checked)}
                  />
                ) : (
                  d.isActive ? "Sí" : "No"
                )}
              </td>
              <td className="border px-2">
                {editingId === d.id ? (
                  <Input
                    type="number"
                    value={editData.minQuantity || ""}
                    onChange={e => handleChange("minQuantity", parseInt(e.target.value))}
                    className="w-16"
                  />
                ) : (
                  d.minQuantity ?? "-"
                )}
              </td>
              <td className="border px-2">
                {editingId === d.id ? (
                  <Input
                    type="number"
                    value={editData.maxQuantity || ""}
                    onChange={e => handleChange("maxQuantity", parseInt(e.target.value))}
                    className="w-16"
                  />
                ) : (
                  d.maxQuantity ?? "-"
                )}
              </td>
              <td className="border px-2">
                {Array.isArray(d.items) ? d.items.join(", ") : "-"}
              </td>
              <td className="border px-2">
                {editingId === d.id ? (
                  <Button size="sm" onClick={handleSave}>Guardar</Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => startEdit(d)}>Editar</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}