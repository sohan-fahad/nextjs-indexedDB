// db.ts
import Dexie, { Table } from 'dexie';

// Define interfaces for each schema
export interface Category {
    id?: number;
    name: string;
}

export interface Product {
    id?: number;
    name: string;
    image: string;
    categoryIds: number[];  // Many-to-many relationship via `productCategories`
}

export interface Order {
    id?: number;
    productId: number;
    categoryId: number;
    orderId: string;
}

export interface ProductCategory {
    id?: number;
    productId: number;
    categoryId: number;
}

// Extend Dexie to define tables with types
class ECommerceDB extends Dexie {
    categories!: Table<Category, number>;
    products!: Table<Product, number>;
    orders!: Table<Order, number>;
    productCategories!: Table<ProductCategory, number>;

    constructor() {
        super("ECommerceDB");
        this.version(1).stores({
            categories: "++id, name",
            products: "++id, name, image, categoryIds",
            orders: "++id, productId, categoryId, orderId",
            productCategories: "++id, productId, categoryId"
        });
    }
}

const db = new ECommerceDB();
export default db;
