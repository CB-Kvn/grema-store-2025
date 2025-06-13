import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// products: [{id, name, price, image}]
export function SelectProductsModal({ open, onClose, products, selected, onSelect }: {
  open: boolean;
  onClose: () => void;
  products: any[];
  selected: number[];
  onSelect: (ids: number[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>(selected);

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSelect(selectedIds);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Selecciona productos</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {products.map((p) => (
            <label
              key={p.id}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${selectedIds.includes(p.id) ? "border-primary-500 bg-primary-50" : "border-transparent"}`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => toggle(p.id)}
                className="accent-primary-600"
              />
              <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
              <span className="flex-1">{p.name}</span>
              <span className="font-semibold text-primary-700">${p.price}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar selección</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}