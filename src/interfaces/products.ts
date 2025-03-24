
  export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    isBestSeller: boolean;
    isNew: boolean;
    sku: string;
    details: {
      material: string;
      piedra: string;
      peso: string;
      largo?:string
      pureza: string;
      color: { hex: string; name: string }[];
      certificado: string;
      garantia: string;
      cierre: {
        tipo: string;
        colores: { hex: string; name: string }[];
      };
    };
    images: string[];
  }
  