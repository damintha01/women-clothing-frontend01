"use client";
import { useRouter } from "next/navigation";
import { useAdminProduct } from "@/lib/admin/use-admin-product";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const { saving, save, uploadImage } = useAdminProduct(undefined);

  async function handleSave(input) {
    const product = await save(input);
    router.push(`/admin/products/${product.id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">New Product</h1>
      <div className="mt-8">
        <ProductForm product={null} onSave={handleSave} saving={saving} onUploadImage={uploadImage} />
      </div>
    </div>
  );
}
