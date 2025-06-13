import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Recibe users y onDescuentoChange como props
export function UsersTable({ users, onDescuentoChange }: {
  users: any[];
  onDescuentoChange: (id: string, value: number) => void;
}) {
  const [editing, setEditing] = useState<{ [id: string]: boolean }>({});
  const [descuentos, setDescuentos] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    const desc: any = {};
    users.forEach((u: any) => (desc[u.id] = u.descuento || 0));
    setDescuentos(desc);
  }, [users]);

  const handleEdit = (id: string) => setEditing((e) => ({ ...e, [id]: true }));
  const handleSave = (id: string) => {
    setEditing((e) => ({ ...e, [id]: false }));
    onDescuentoChange(id, descuentos[id]);
  };
  const handleChange = (id: string, value: string) =>
    setDescuentos((d) => ({ ...d, [id]: Number(value) }));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-xs">
        <thead>
          <tr className="bg-primary-100">
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Google ID</th>
            <th className="px-2 py-1 border">Email</th>
            <th className="px-2 py-1 border">Nombre</th>
            <th className="px-2 py-1 border">Avatar</th>
            <th className="px-2 py-1 border">Creado</th>
            <th className="px-2 py-1 border">Descuento</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id}>
              <td className="border px-2">{u.id}</td>
              <td className="border px-2">{u.googleId}</td>
              <td className="border px-2">{u.email}</td>
              <td className="border px-2">{u.name}</td>
              <td className="border px-2">
                {u.avatar ? (
                  <img src={u.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2">{u.createdAt?.slice(0, 10)}</td>
              <td className="border px-2">
                {editing[u.id] ? (
                  <>
                    <Input
                      type="number"
                      value={descuentos[u.id]}
                      onChange={(e) => handleChange(u.id, e.target.value)}
                      className="w-16 inline-block"
                    />
                    <Button size="sm" onClick={() => handleSave(u.id)} className="ml-1">
                      Guardar
                    </Button>
                  </>
                ) : (
                  <>
                    {descuentos[u.id]}%
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(u.id)} className="ml-1">
                      Editar
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}