"use client";
import db, { Category } from "@/db";
import { useState, useEffect, ChangeEvent } from "react";

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const allCategories = await db.categories.toArray();
      setCategories(allCategories);
    };
    fetchCategories();
  }, []);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategories(
      Array.from(e.target.selectedOptions, (option) => parseInt(option.value))
    );
  };

  const addProduct = async () => {
    const productId = await db.products.add({
      name,
      image,
      categoryIds: selectedCategories,
    });
    await Promise.all(
      selectedCategories.map((categoryId) =>
        db.productCategories.add({ productId, categoryId })
      )
    );
    setName("");
    setImage("");
    setSelectedCategories([]);
  };

  return (
    <div>
      <h1>Create Product</h1>
      <input
        value={name}
        onChange={handleNameChange}
        placeholder="Product Name"
        className="text-black"
      />
      <input
        value={image}
        onChange={handleImageChange}
        placeholder="Image URL"
        className="text-black"
      />
      <select
        multiple
        value={selectedCategories.map(String)}
        onChange={handleCategoryChange}
        className="text-black"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}
