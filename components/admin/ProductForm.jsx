"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  price: "",
  comparePrice: "",
  collectionId: "",
  tags: "",
  images: [],
  isFeatured: false,
  isExclusive: false,
  isVisible: true,
};

export function ProductForm({ product, onSave, saving, onAddVariant, onUpdateVariantStock, onRemoveVariant, onUploadImage }) {
  const [values, setValues] = useState(EMPTY);
  const [collections, setCollections] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [variantDraft, setVariantDraft] = useState({ size: "", color: "", stock: 0, sku: "" });

  useEffect(() => {
    fetch("/api/collections")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setCollections(data.collections));
  }, []);

  useEffect(() => {
    if (product) {
      setValues({
        name: product.name ?? "",
        slug: product.slug ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        comparePrice: product.compareAtPrice ?? "",
        collectionId: "",
        tags: (product.badges ?? []).join(", "),
        images: (product.images ?? []).map((i) => i.url),
        isFeatured: false,
        isExclusive: false,
        isVisible: true,
      });
    }
  }, [product]);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    setUploading(true);
    try {
      const image = await onUploadImage(file);
      if (image) set("images", [...values.images, image.url]);
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      name: values.name,
      slug: values.slug || undefined,
      description: values.description,
      price: Number(values.price),
      comparePrice: values.comparePrice ? Number(values.comparePrice) : undefined,
      collectionId: values.collectionId || undefined,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: values.images,
      isFeatured: values.isFeatured,
      isExclusive: values.isExclusive,
      isVisible: values.isVisible,
    });
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Slug (optional)</label>
          <input
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Price (LKR)</label>
          <input
            required
            type="number"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Compare-at price</label>
          <input
            type="number"
            value={values.comparePrice}
            onChange={(e) => set("comparePrice", e.target.value)}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Collection</label>
          <select
            value={values.collectionId}
            onChange={(e) => set("collectionId", e.target.value)}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          >
            <option value="">None</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Tags (comma separated)</label>
          <input
            value={values.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="new, sale, bestseller, limited"
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Images</label>
          <div className="mt-2 flex flex-wrap gap-3">
            {values.images.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="h-20 w-16 object-cover" />
                <button
                  type="button"
                  onClick={() => set("images", values.images.filter((_, idx) => idx !== i))}
                  className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
            <label className="grid h-20 w-16 cursor-pointer place-items-center border border-dashed border-border text-xs text-muted-foreground">
              {uploading ? "…" : "+ Add"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={values.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={values.isExclusive} onChange={(e) => set("isExclusive", e.target.checked)} />
            Exclusive
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={values.isVisible} onChange={(e) => set("isVisible", e.target.checked)} />
            Visible on storefront
          </label>
        </div>

        <button className="rounded bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50 sm:col-span-2 sm:w-fit" disabled={saving}>
          {saving ? "Saving…" : "Save product"}
        </button>
      </form>

      {product && (
        <div>
          <p className="mb-4 text-sm font-medium">Variants</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="pb-2">Size</th>
                <th className="pb-2">Color</th>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {(product.variants ?? []).map((v) => (
                <tr key={v.id} className="border-b border-border">
                  <td className="py-2">{v.size}</td>
                  <td className="py-2">{v.color}</td>
                  <td className="py-2">{v.sku}</td>
                  <td className="py-2">
                    <input
                      type="number"
                      defaultValue={v.stock}
                      onBlur={(e) => onUpdateVariantStock(v.id, Number(e.target.value))}
                      className="w-20 border border-border bg-transparent px-2 py-1 outline-none focus:border-foreground"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button onClick={() => onRemoveVariant(v.id)} className="text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Size</label>
              <input
                value={variantDraft.size}
                onChange={(e) => setVariantDraft((v) => ({ ...v, size: e.target.value }))}
                className="mt-1 w-20 border border-border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Color</label>
              <input
                value={variantDraft.color}
                onChange={(e) => setVariantDraft((v) => ({ ...v, color: e.target.value }))}
                className="mt-1 w-28 border border-border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Stock</label>
              <input
                type="number"
                value={variantDraft.stock}
                onChange={(e) => setVariantDraft((v) => ({ ...v, stock: Number(e.target.value) }))}
                className="mt-1 w-20 border border-border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">SKU</label>
              <input
                value={variantDraft.sku}
                onChange={(e) => setVariantDraft((v) => ({ ...v, sku: e.target.value }))}
                className="mt-1 w-28 border border-border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-foreground"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onAddVariant(variantDraft);
                setVariantDraft({ size: "", color: "", stock: 0, sku: "" });
              }}
              className="rounded border border-foreground px-4 py-1.5 text-sm"
            >
              Add variant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
