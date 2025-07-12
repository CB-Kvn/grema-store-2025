import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cantones, ProvinciaId, provincias } from '@/utils/location';

interface OrderAddressInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  provincia: string;
  canton: string;
  zipCode: string;
}

interface OrderAddressFormProps {
  values: OrderAddressInfo;
  onChange: (values: OrderAddressInfo) => void;
  title?: string;
}

const OrderAddressForm: React.FC<OrderAddressFormProps> = ({
  values,
  onChange,
  title = 'Dirección',
}) => {
  const [selectedProvincia, setSelectedProvincia] = useState<ProvinciaId | ''>('');
  const [availableCantones, setAvailableCantones] = useState<typeof cantones[ProvinciaId]>(cantones["1"]);

  useEffect(() => {
    if (selectedProvincia && selectedProvincia in cantones) {
      setAvailableCantones(cantones[selectedProvincia as ProvinciaId]);
      if (!cantones[selectedProvincia as ProvinciaId].find(c => c.nombre === values.canton)) {
        onChange({ ...values, canton: '', zipCode: '' });
      }
    }
  }, [selectedProvincia]);

  useEffect(() => {
    if (values.provincia) {
      setSelectedProvincia(values.provincia as ProvinciaId);
    }
  }, [values.provincia]);

  const handleProvinciaChange = (value: string) => {
    setSelectedProvincia(value as ProvinciaId);
    onChange({ ...values, provincia: value, canton: '', zipCode: '' });
  };

  const handleCantonChange = (value: string) => {
    const canton = availableCantones.find(c => c.nombre === value);
    onChange({
      ...values,
      canton: value,
      zipCode: canton ? canton.codigoPostal : ''
    });
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-primary-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            required
            value={values.firstName}
            onChange={e => onChange({ ...values, firstName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            required
            value={values.lastName}
            onChange={e => onChange({ ...values, lastName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            required
            value={values.email}
            onChange={e => onChange({ ...values, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            type="tel"
            id="phone"
            required
            value={values.phone}
            onChange={e => onChange({ ...values, phone: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            required
            value={values.address}
            onChange={e => onChange({ ...values, address: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="provincia">Provincia</Label>
          <Select
            value={values.provincia}
            onValueChange={handleProvinciaChange}
            required
          >
            <SelectTrigger id="provincia">
              <SelectValue placeholder="Seleccionar provincia" />
            </SelectTrigger>
            <SelectContent>
              {provincias.map(provincia => (
                <SelectItem key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="canton">Cantón</Label>
          <Select
            value={values.canton}
            onValueChange={handleCantonChange}
            disabled={!selectedProvincia}
            required
          >
            <SelectTrigger id="canton">
              <SelectValue placeholder="Seleccionar cantón" />
            </SelectTrigger>
            <SelectContent>
              {availableCantones.map(canton => (
                <SelectItem key={canton.codigoPostal} value={canton.nombre}>
                  {canton.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zipCode">Código Postal</Label>
          <Input
            id="zipCode"
            value={values.zipCode}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderAddressForm;