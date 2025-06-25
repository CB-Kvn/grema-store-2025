import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

import { AddressInfo } from '@/interfaces/checkout';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cantones, ProvinciaId, provincias } from '@/utils/location';



interface AddressFormProps {
    type: 'shipping' | 'billing';
    values: AddressInfo;
    onChange: (values: AddressInfo) => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack?: () => void;
  }
  
  const AddressForm: React.FC<AddressFormProps> = ({
    type,
    values,
    onChange,
    onSubmit,
    onBack,
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
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer ID Field */}
          <div className="md:col-span-2">
            <Label htmlFor={`${type}BuyerId`}>ID del Comprador</Label>
            <div className="mt-1 relative">
              <Input
                id={`${type}BuyerId`}
                value={values.buyerId}
                onChange={(e) => onChange({ ...values, buyerId: e.target.value })}
                placeholder="Ingresa tu ID de comprador (opcional)"
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {type === 'shipping' ? 'ID para envío' : 'ID para facturación'} (opcional)
            </p>
          </div>
  
          <div>
            <Label htmlFor={`${type}FirstName`}>Nombre:</Label>
            <Input
              id={`${type}FirstName`}
              required
              value={values.firstName}
              onChange={(e) => onChange({ ...values, firstName: e.target.value })}
            />
          </div>
  
          <div>
            <Label htmlFor={`${type}LastName`}>Apellido</Label>
            <Input
              id={`${type}LastName`}
              required
              value={values.lastName}
              onChange={(e) => onChange({ ...values, lastName: e.target.value })}
            />
          </div>
  
          <div>
            <Label htmlFor={`${type}Email`}>Email</Label>
            <Input
              type="email"
              id={`${type}Email`}
              required
              value={values.email}
              onChange={(e) => onChange({ ...values, email: e.target.value })}
            />
          </div>
  
          <div>
            <Label htmlFor={`${type}Phone`}>Teléfono</Label>
            <Input
              type="tel"
              id={`${type}Phone`}
              required
              value={values.phone}
              onChange={(e) => onChange({ ...values, phone: e.target.value })}
            />
          </div>
  
          <div className="md:col-span-2">
            <Label htmlFor={`${type}Address`}>Dirección</Label>
            <Input
              id={`${type}Address`}
              required
              value={values.address}
              onChange={(e) => onChange({ ...values, address: e.target.value })}
            />
          </div>
  
          {/* Provincia Select */}
          <div>
            <Label htmlFor={`${type}Provincia`}>Provincia</Label>
            <Select
              value={values.provincia}
              onValueChange={handleProvinciaChange}
              required
            >
              <SelectTrigger id={`${type}Provincia`}>
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
  
          {/* Canton Select */}
          <div>
            <Label htmlFor={`${type}Canton`}>Cantón</Label>
            <Select
              value={values.canton}
              onValueChange={handleCantonChange}
              disabled={!selectedProvincia}
              required
            >
              <SelectTrigger id={`${type}Canton`}>
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
  
          {/* Código Postal (read-only) */}
          <div>
            <Label htmlFor={`${type}ZipCode`}>Código Postal</Label>
            <Input
              id={`${type}ZipCode`}
              value={values.zipCode}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
  
        <div className="flex justify-between">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-primary-600 hover:text-primary-700"
            >
              Volver
            </button>
          )}
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors ml-auto"
          >
            Continuar
          </button>
        </div>
      </form>
    );
  };
  
  export default AddressForm;