

export interface Item {
    id:           string;
    orderId:      string;
    productId:    number;
    quantity:     number;
    unitPrice:    number;
    totalPrice:   number;
    qtyDone:      number | null;
    isGift:       boolean;
    isBestSeller: boolean;
    isNew:        boolean;
    status:       string;
    product?:     Product;
}

export interface PurchaseOrder {
    id:                   string;
    buyerId:              string;
    firstName:            string;
    lastName:             string;
    email:                string;
    phone:                string;
    orderNumber:          string;
    dataShipping:         string;
    dataBilling:          string;
    status:               string;
    orderDate:            Date | string;
    expectedDeliveryDate: Date | string | null;
    actualDeliveryDate:   Date | string | null;
    subtotalAmount:       number;
    totalAmount:          number;
    shippingAmount:       number;
    paymentMethod:        string;
    paymentStatus:        string;
    trackingNumber:       string | null;
    notes:                string | null;
    createdAt:            Date;
    updatedAt:            Date;
    items:                Item[];
    documents?:           any[];
}

export interface Product {
    id:          number;
    name:        string;
    description: string;
    category:    string;
    sku:         string;
    details:     Details;
    createdAt:   Date;
    updatedAt:   Date;
    available:   boolean;
}

export interface Details {
    peso:        string;
    color:       Color[];
    largo:       string;
    cierre:      Cierre;
    piedra:      string[];
    pureza:      string;
    garantia:    string;
    material:    string[] | string;
    certificado: string;
}

export interface Cierre {
    tipo:    string;
    colores: Color[];
}

export interface Color {
    hex:  string;
    name: string;
}