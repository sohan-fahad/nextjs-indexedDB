"use client";
import { useEffect, useState } from "react";
import db, { Order, Product, Category } from "../../db";

interface OrderWithDetails extends Order {
  product?: Product;
  category?: Category;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await db.orders.toArray();
      const ordersWithDetails = await Promise.all(
        allOrders.map(async (order) => {
          const product = await db.products.get(order.productId);
          const category = await db.categories.get(order.categoryId);
          return { ...order, product, category };
        })
      );
      setOrders(ordersWithDetails);
    };
    fetchOrders();
  }, []);

  return (
    <div className="text-white">
      <h1>Orders</h1>
      {orders.map((order) => (
        <div key={order.id}>
          <h2>Order #{order.orderId}</h2>
          <p>Product: {order.product?.name}</p>
          <p>Category: {order.category?.name}</p>
        </div>
      ))}
    </div>
  );
}
