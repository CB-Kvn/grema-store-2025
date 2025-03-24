/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LogoInitial } from "@/components/initial-page/logoInitial";
import ProductCard from "@/components/product/ProductCard";
import { useNavigate } from "react-router-dom";
import { Info_Bussiness } from "@/components/initial-page/bussiness";
import { Product } from "@/interfaces/products";
import ContactPage from "@/components/initial-page/contact";
import Aos from "aos";
import "aos/dist/aos.css";

const categories = [
  { id: "all", name: "Todas las Joyas" },
  { id: "rings", name: "Anillos" },
  { id: "necklaces", name: "Collares" },
  { id: "earrings", name: "Aretes" },
  { id: "bracelets", name: "Pulseras" },
  { id: "sets", name: "Sets" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Anillo de Compromiso con Diamante 1",
    price: 2499.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 1",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-001",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "3.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 2,
    name: "Anillo de Compromiso con Diamante 2",
    price: 2599.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 2",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-002",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "4.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 3,
    name: "Anillo de Compromiso con Diamante 3",
    price: 2699.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 3",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-003",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "4.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 4,
    name: "Anillo de Compromiso con Diamante 4",
    price: 2799.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 4",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-004",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "5.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 5,
    name: "Anillo de Compromiso con Diamante 5",
    price: 2899.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 5",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-005",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "5.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 6,
    name: "Anillo de Compromiso con Diamante 6",
    price: 2999.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 6",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-006",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "6.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 7,
    name: "Anillo de Compromiso con Diamante 7",
    price: 3099.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 7",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-007",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "6.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 8,
    name: "Anillo de Compromiso con Diamante 8",
    price: 3199.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 8",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-008",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "7.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 9,
    name: "Anillo de Compromiso con Diamante 9",
    price: 3299.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Elegante anillo de oro 18k con diamante de corte brillante 9",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-009",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "7.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 10,
    name: "Anillo de Compromiso con Diamante 10",
    price: 3399.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 10",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-010",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "8.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 11,
    name: "Anillo de Compromiso con Diamante 11",
    price: 3499.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 11",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-011",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "8.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 12,
    name: "Anillo de Compromiso con Diamante 12",
    price: 3599.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 12",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-012",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "9.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 13,
    name: "Anillo de Compromiso con Diamante 13",
    price: 3699.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 13",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-013",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "9.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 14,
    name: "Anillo de Compromiso con Diamante 14",
    price: 3799.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 14",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-014",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "10.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 15,
    name: "Anillo de Compromiso con Diamante 15",
    price: 3899.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 15",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-015",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "10.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 16,
    name: "Anillo de Compromiso con Diamante 16",
    price: 3999.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 16",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-016",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "11.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 17,
    name: "Anillo de Compromiso con Diamante 17",
    price: 4099.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 17",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-017",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "11.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 18,
    name: "Anillo de Compromiso con Diamante 18",
    price: 4199.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 18",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-018",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "12.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 19,
    name: "Anillo de Compromiso con Diamante 19",
    price: 4299.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 19",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-019",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "12.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 20,
    name: "Anillo de Compromiso con Diamante 20",
    price: 4399.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 20",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-020",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "13.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 21,
    name: "Anillo de Compromiso con Diamante 21",
    price: 4499.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 21",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-021",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "13.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 22,
    name: "Anillo de Compromiso con Diamante 22",
    price: 4599.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 22",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-022",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "14.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 23,
    name: "Anillo de Compromiso con Diamante 23",
    price: 4699.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 23",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-023",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "14.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 24,
    name: "Anillo de Compromiso con Diamante 24",
    price: 4799.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 24",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-024",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "15.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 25,
    name: "Anillo de Compromiso con Diamante 25",
    price: 4899.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 25",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-025",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "15.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 26,
    name: "Anillo de Compromiso con Diamante 26",
    price: 4999.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 26",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-026",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "16.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 27,
    name: "Anillo de Compromiso con Diamante 27",
    price: 5099.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 27",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-027",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "16.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 28,
    name: "Anillo de Compromiso con Diamante 28",
    price: 5199.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 28",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-028",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "17.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 29,
    name: "Anillo de Compromiso con Diamante 29",
    price: 5299.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 29",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-029",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "17.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 30,
    name: "Anillo de Compromiso con Diamante 30",
    price: 5399.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 30",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-030",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "18.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 31,
    name: "Anillo de Compromiso con Diamante 31",
    price: 5499.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 31",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-031",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "18.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 32,
    name: "Anillo de Compromiso con Diamante 32",
    price: 5599.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 32",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-032",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "19.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 33,
    name: "Anillo de Compromiso con Diamante 33",
    price: 5699.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 33",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-033",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "19.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 34,
    name: "Anillo de Compromiso con Diamante 34",
    price: 5799.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 34",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-034",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "20.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 35,
    name: "Anillo de Compromiso con Diamante 35",
    price: 5899.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 35",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-035",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "20.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 36,
    name: "Anillo de Compromiso con Diamante 36",
    price: 5999.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 36",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-036",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "21.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 37,
    name: "Anillo de Compromiso con Diamante 37",
    price: 6099.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 37",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-037",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "21.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 38,
    name: "Anillo de Compromiso con Diamante 38",
    price: 6199.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 38",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-038",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "22.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 39,
    name: "Anillo de Compromiso con Diamante 39",
    price: 6299.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 39",
    category: "rings",
    isBestSeller: true,
    isNew: false,
    sku: "RING-DIA-039",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "22.5g",
      pureza: "VS1",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 40,
    name: "Anillo de Compromiso con Diamante 40",
    price: 6399.99,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegante anillo de oro 18k con diamante de corte brillante 40",
    category: "rings",
    isBestSeller: false,
    isNew: true,
    sku: "RING-DIA-040",
    details: {
      material: "Oro 18k",
      piedra: "Diamante",
      peso: "23.0g",
      pureza: "VS2",
      color: [
        { hex: "#FFFFFF", name: "Blanco" },
        { hex: "#FFF9E5", name: "Marfil" },
      ],
      certificado: "GIA",
      garantia: "2 años",
      cierre: {
        tipo: "Presión",
        colores: [
          { hex: "#FFD700", name: "Oro" },
          { hex: "#FFFFFF", name: "Platino" },
        ],
      },
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ProductInitial {
  addToCart: (product: (typeof products)[0]) => void;
}

type TabType = "bestSellers" | "newArrivals";

export const Initial: React.FC<ProductInitial> = ({ addToCart }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const [activeTab, setActiveTab] = useState<TabType>("bestSellers");
  const bestSellers = products.filter((product) => product.isBestSeller);
  const newArrivals = products.filter((product) => product.isNew);

  const SectionTitle = ({
    icon: Icon,
    title,
    subtitle,
  }: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
  }) => (
    <div className="flex flex-col items-center justify-center mb-12">
      <div className="flex items-center mb-4">
        <div className="hidden sm:block w-32 h-px bg-primary-300 mr-4" />
        <Icon className="h-8 sm:h-10 w-8 sm:w-10 text-primary-600 mx-3" />
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900">
          {title}
        </h2>
        <div className="hidden sm:block w-32 h-px bg-primary-300 ml-4" />
      </div>
      {subtitle && (
        <p className="text-center text-primary-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}

      <LogoInitial></LogoInitial>

      {/* Categories */}
      <div
        className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-6 sm:py-8 -mt-4"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="flex justify-center">
          <div className="inline-flex space-x-2 sm:space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-xl font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary-600 text-white"
                    : "bg-white text-primary-800 hover:bg-primary-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div
        className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 -m-10 py-6"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex items-center">
            <div className="hidden sm:block w-32 h-px bg-primary-300 mr-4" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900">
              {selectedCategory === "all"
                ? "Colección Destacada"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <div className="hidden sm:block w-32 h-px bg-primary-300 ml-4" />
          </div>
        </div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          className="pb-12"
        >
          {filteredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={() => addToCart(product)}
                onClick={() => navigate(`/producto/${product.id}`)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-primary-500">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Featured Collections Tabs */}
      <div
        className=" py-16 sm:py-24 bg-primary-50 "
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-primary-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab("bestSellers")}
                className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "bestSellers"
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-primary-600 hover:bg-primary-50"
                }`}
              >
                <Flame className="h-4 w-4 mr-2" />
                Más Vendidos
              </button>
              <button
                onClick={() => setActiveTab("newArrivals")}
                className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "newArrivals"
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-primary-600 hover:bg-primary-50"
                }`}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Novedades
              </button>
            </div>
          </div>

          {/* Best Sellers Content */}
          <div className={activeTab === "bestSellers" ? "block" : "hidden"}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
                Nuestros Más Vendidos
              </h2>
              <p className="text-primary-600 max-w-2xl mx-auto">
                Descubre las piezas que han cautivado a nuestros clientes. Joyas
                atemporales que combinan elegancia y exclusividad.
              </p>
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className="pb-12"
            >
              {bestSellers.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onClick={() => navigate(`/producto/${product.id}`)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* New Arrivals Content */}
          <div className={activeTab === "newArrivals" ? "block" : "hidden"}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
                Últimas Novedades
              </h2>
              <p className="text-primary-600 max-w-2xl mx-auto">
                Explora nuestras más recientes creaciones. Diseños innovadores
                que marcan tendencia en joyería fina.
              </p>
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className="pb-12"
            >
              {newArrivals.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onClick={() => navigate(`/producto/${product.id}`)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <Info_Bussiness></Info_Bussiness>

      <ContactPage></ContactPage>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Columna 1: Sobre Joyas de Lujo */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Sobre Joyas de Lujo
              </h3>
              <p className="text-sm sm:text-base text-primary-200">
                Creando piezas atemporales de elegancia desde 1990. Cada pieza
                cuenta una historia única.
              </p>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Tienda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Contacto
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Preguntas Frecuentes
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Servicio al Cliente */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Servicio al Cliente
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Política de Envíos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Devoluciones y Cambios
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Guía de Tallas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-primary-200 hover:text-white"
                  >
                    Instrucciones de Cuidado
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 4: Imagen a la derecha */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex justify-center items-center">
              <img
                src="../../public/Logo en blamco.png" // Ruta de la imagen
                alt="Imagen decorativa" // Texto alternativo
                className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-lg" // Estilos de la imagen
              />
            </div>
          </div>

          {/* Derechos de autor */}
          <div className="border-t border-primary-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-sm sm:text-base text-primary-200">
            <p>&copy; 2024 Joyas de Lujo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Initial;
