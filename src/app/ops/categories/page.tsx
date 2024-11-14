// pages/ops/category.tsx
"use client";
import db from "@/db";
import { useState, ChangeEvent } from "react";

export default function CategoryPage() {
  const [name, setName] = useState<string>("");

  const addCategory = async () => {
    if (name.trim()) {
      await db.categories.add({ name });
      setName("");
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div>
      <h1>Create Category</h1>
      <input
        value={name}
        onChange={handleNameChange}
        placeholder="Category Name"
      />
      <button onClick={addCategory}>Add Category</button>
    </div>
  );
}
