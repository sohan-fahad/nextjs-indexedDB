"use client";
import { useEffect, useState } from "react";
import db, { Category, Product, ProductCategory } from "../db";
import Image from "next/image";

interface CategoryWithProducts extends Category {
  products: Product[];
}

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      // Fetch all categories
      const allCategories = await db.categories.toArray();

      const categoryData = await Promise.all(
        allCategories.map(async (category) => {
          // Fetch productCategory entries for the current category
          const productCategoryEntries = await db.productCategories
            .where("categoryId")
            .equals(category.id as number)
            .toArray();

          // Fetch each product using the productId from productCategory entries
          const products = await Promise.all(
            productCategoryEntries.map(async (entry: ProductCategory) => {
              const product = await db.products.get(entry.productId);
              return product as Product;
            })
          );

          return { ...category, products: products.filter(Boolean) }; // Filter out any null products
        })
      );

      setCategories(categoryData);
    };

    fetchCategoriesAndProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const placeOrder = async () => {
    const orderId = `ORD-${Date.now()}`;
    await Promise.all(
      cart.map(async (product) => {
        await db.orders.add({
          productId: product.id as number,
          categoryId: product.categoryIds[0],
          orderId,
        });
      })
    );
    setCart([]);
  };

  return (
    <div>
      <h1>Products by Category</h1>
      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          {category.products.map((product) => (
            <div key={product.id}>
              <p>{product.name}</p>
              <Image
                src={product.image}
                alt={product.name}
                height={100}
                width={100}
              />
              <button
                className="bg-white text-black"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ))}
      <button onClick={placeOrder} disabled={cart.length === 0}>
        Place Order
      </button>
    </div>
  );
}
