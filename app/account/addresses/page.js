"use client";
import { useState } from "react";
import { useAddresses } from "@/lib/account/use-addresses";
import { AddressCard } from "@/components/account/AddressCard";
import { AddressFormModal } from "@/components/account/AddressFormModal";
import { Reveal } from "@/components/Reveal";

export default function AddressesPage() {
  const { addresses, isLoading, mutatingId, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddresses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(address) {
    setEditing(address);
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    if (editing) await updateAddress(editing.id, values);
    else await addAddress(values);
  }

  if (isLoading) return <p className="eyebrow text-muted-foreground">Loading…</p>;

  return (
    <div>
      <Reveal className="mb-8 flex items-center justify-between">
        <p className="eyebrow text-muted-foreground">{addresses.length} saved addresses</p>
        <button onClick={openAdd} className="btn-lux">
          Add address
        </button>
      </Reveal>

      {addresses.length === 0 ? (
        <p className="font-serif text-2xl text-muted-foreground">No addresses saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {addresses.map((address, i) => (
            <Reveal key={address.id} delay={i * 80}>
              <AddressCard
                address={address}
                mutating={mutatingId === address.id}
                onEdit={() => openEdit(address)}
                onDelete={() => removeAddress(address.id)}
                onSetDefault={() => setDefaultAddress(address.id)}
              />
            </Reveal>
          ))}
        </div>
      )}

      <AddressFormModal open={modalOpen} onClose={() => setModalOpen(false)} initialValue={editing} onSubmit={handleSubmit} />
    </div>
  );
}
