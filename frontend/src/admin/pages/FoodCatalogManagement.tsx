import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { Modal } from "../components/ui/Modal.tsx";
import { Table } from "../components/ui/Table.tsx";
import { adminApi } from "../services/adminApi.ts";
import { ImageUploader } from "../../shared/ImageUploader";
import type { FoodCategory, FoodItem } from "../types/index.ts";

const initialForm = {
  name: "",
  description: "",
  price: 0,
  chefId: "",
  imageUrl: "",
  categoryId: "",
};

export const FoodCatalogManagement = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formState, setFormState] = useState(initialForm);

  const modalTitle = useMemo(
    () => (editingItem ? "Edit Food Item" : "Add Food Item"),
    [editingItem],
  );

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);

      try {
        const categoryData = await adminApi.getFoodCategories();
        setCategories(categoryData);
        // TODO: Wire up Axios call here (fetch food catalog)
        const data = await adminApi.getFoodItems();
        setItems(data);
      } catch {
        setItems(adminApi.getMockFoodItems());
        setCategories(adminApi.getMockFoodCategories());
      } finally {
        setLoading(false);
      }
    };

    void loadItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      description: item.description,
      price: item.price,
      chefId: item.chefId,
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormState(initialForm);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingItem && !formState.imageUrl) {
      alert("Please upload or paste a food image before creating the item.");
      return;
    }

    if (editingItem) {
      // TODO: Wire up Axios call here (update food item)
      try {
        const updated = await adminApi.updateFoodItem(
          editingItem.id,
          formState,
        );
        setItems((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      } catch (err) {
        alert(`Failed to update food item: ${(err as Error).message}`);
        closeModal();
        return;
      }
    } else {
      // TODO: Wire up Axios call here (create food item)
      try {
        const created = await adminApi.createFoodItem(formState);
        setItems((prev) => [created, ...prev]);
      } catch (err) {
        alert(`Failed to create food item: ${(err as Error).message}`);
        closeModal();
        return;
      }
    }

    closeModal();
  };

  const handleDelete = async (itemId: string) => {
    const confirmed = window.confirm("Delete this food item permanently?");

    if (!confirmed) {
      return;
    }

    // TODO: Wire up Axios call here (delete food item)
    try {
      await adminApi.deleteFoodItem(itemId);
    } finally {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Food Catalog</h3>
          <p className="text-sm text-slate-500">
            Create, update, and remove food items across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <FiPlus />
          Add Food Item
        </button>
      </div>

      <Table
        columns={[
          {
            key: "image",
            header: "Image",
            render: (row) => (
              <img
                src={row.imageUrl}
                alt={row.name}
                className="h-12 w-12 rounded-xl object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ),
          },
          { key: "name", header: "Name", render: (row) => row.name },
          {
            key: "category",
            header: "Category",
            render: (row) => row.categoryName,
          },
          {
            key: "chef",
            header: "Chef ID",
            render: (row) => (
              <span className="font-mono text-xs">{row.chefId}</span>
            ),
          },
          {
            key: "price",
            header: "Price",
            render: (row) => `LKR ${row.price.toLocaleString()}`,
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(row)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                >
                  <FiEdit2 />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(row.id)}
                  className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
                >
                  <FiTrash2 />
                </button>
              </div>
            ),
          },
        ]}
        rows={loading ? [] : items}
        rowKey={(row) => row.id}
        emptyMessage={
          loading ? "Loading food catalog..." : "No food items found."
        }
      />

      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="food-form"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {editingItem ? "Save Changes" : "Create Item"}
            </button>
          </div>
        }
      >
        <form id="food-form" className="space-y-4" onSubmit={handleSave}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </span>
            <input
              type="text"
              required
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, name: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </span>
            <textarea
              required
              value={formState.description}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              className="h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </span>
              <select
                required
                value={formState.categoryId}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    categoryId: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Price (LKR)
              </span>
              <input
                type="number"
                min={0}
                required
                value={formState.price}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    price: Number(event.target.value),
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Chef ID
              </span>
              <input
                type="text"
                required
                value={formState.chefId}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    chefId: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </label>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Food image
            </span>
            <ImageUploader
              value={formState.imageUrl}
              onChange={(imageUrl) =>
                setFormState((prev) => ({ ...prev, imageUrl }))
              }
              token={localStorage.getItem("admin_token")}
            />
          </div>
        </form>
      </Modal>
    </section>
  );
};
