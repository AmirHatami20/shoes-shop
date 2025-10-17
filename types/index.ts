// USER
// ======================
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: "user" | "admin";
    createdAt?: Date;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// CATEGORY
// ======================
export interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    parent?: Category;
    children?: Category[];
}

export interface CategoryPayload {
    name: string;
    slug: string;
    parentId?: number | null;
}

export type CategoryHierarchy = {
    mainCategory: Category;
    parentCategory: Category;
    finalCategory: Category;
};

// BRAND
// ======================
export interface Brand {
    id: number;
    name: string;
    slug: string;
    products?: Product[];
}

export interface BrandPayload {
    name: string;
    slug: string;
}

// PRODUCT
// ======================
export interface Product {
    id?: number;
    name: string;
    description?: string;
    price: number;
    discount?: number;
    finalPrice?: number;
    createdAt?: Date;
    categoryId: number;
    category?: CategoryHierarchy;
    brandId: number;
    brand?: Brand;
    colors: ProductColor[];
    material?: string;
    totalSells?: number;
}

export interface ProductColor {
    id?: number;
    productId?: number;
    color: string;
    images: (ProductImage | File)[];
    sizes: ProductSize[];
}

export interface ProductImage {
    id?: number;
    productColorId?: number;
    url: string;
}

export interface ProductSize {
    id?: number;
    productColorId?: number;
    size: number;
    stock: number;
}

export interface ProductQueryParams {
    search?: string;
    categorySlug?: string;
    brandSlug?: string;
    page?: number;
    limit?: number;
    sort?: string;
    size?: number[];
    minPrice?: number;
    maxPrice?: number;
}

// CART / CART ITEM
// ======================
export interface Cart {
    id: number;
    userId: number;
    items?: CartItem[];
}

export interface CartItem {
    id: number;
    cartId?: number;
    productId: number;
    product: Product;
    color: string;
    size: number;
    quantity: number;
}

export interface CartItemPayload {
    productId: number;
    color: string;
    size: number;
    quantity?: number;
}


// ORDER / ORDER ITEM / SHIPPING
// ======================
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface ShippingAddress {
    id: number;
    orderId: number;
    firstName: string;
    lastName: string;
    phone: string;
    province: string;
    city: string;
    street: string;
    alley: string;
    buildingNumber: number;
    apartment: number;
    postalCode?: string;
}

export interface CreateShippingAddress {
    firstName: string;
    lastName: string;
    phone: string;
    province: string;
    city: string;
    street: string;
    alley: string;
    buildingNumber: number;
    apartment: number;
    postalCode: string;
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    product?: Product;
    quantity: number;
    finalPrice: number;
}

export interface Order {
    id: number;
    userId: number;
    user?: User;
    items: OrderItem[];
    status: OrderStatus;
    shippingAddress?: ShippingAddress;
    totalPrice: number;
    createdAt?: Date;
    updatedAt: Date;
}

export interface CreateOrderPayload {
    items: {
        productId: number;
        quantity: number;
        finalPrice: number;
    }[];
    shippingAddress: CreateShippingAddress;
}


// ERROR
// ======================
export interface ErrorResponse {
    response?: {
        data?: {
            error?: string;
        };
    };
}
