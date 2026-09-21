"use client";
import { use } from "react";
import { useAdminProduct } from "@/lib/admin/use-admin-product";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const { product, isLoading, saving, save, addVariant, updateVariantStock, removeVariant, uploadImage } =
    useAdminProduct(id);

  if (isLoading || !product) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <div className="mt-8">
        <ProductForm
          product={product}
          onSave={(input) => save(input)}
          saving={saving}
          onAddVariant={addVariant}
          onUpdateVariantStock={updateVariantStock}
          onRemoveVariant={removeVariant}
          onUploadImage={uploadImage}
        />
      </div>
    </div>
  );
}
