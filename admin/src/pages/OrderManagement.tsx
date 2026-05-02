import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Modal } from "../components/ui/Modal.tsx";
import { Table } from "../components/ui/Table.tsx";
import { adminApi } from "../services/adminApi.ts";
import type { Order, OrderStatus } from "../types/index.ts";

const statusOptions: OrderStatus[] = ["Pending", "Quoted", "Paid", "Completed"];

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("Pending");

  const modalTitle = useMemo(() => "Edit Order Status", []);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);

      try {
        // TODO: Wire up Axios call here (fetch all orders)
        const data = await adminApi.getOrders();
        setOrders(data);
      } catch {
        setOrders(adminApi.getMockOrders());
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleSaveStatus = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedOrder) {
      return;
    }

    // TODO: Wire up Axios call here (update order status)
    try {
      const updated = await adminApi.updateOrderStatus(
        selectedOrder.id,
        status,
      );
      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order)),
      );
    } catch {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? { ...order, status } : order,
        ),
      );
    }

    closeModal();
  };

  const handleDelete = async (orderId: string) => {
    const confirmed = window.confirm("Delete this order permanently?");

    if (!confirmed) {
      return;
    }

    // TODO: Wire up Axios call here (delete order)
    try {
      await adminApi.deleteOrder(orderId);
    } finally {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Orders</h3>
        <p className="text-sm text-slate-500">
          Monitor and override platform order statuses.
        </p>
      </div>

      <Table
        columns={[
          {
            key: "id",
            header: "Order ID",
            render: (row) => (
              <span className="font-mono text-xs">{row.id}</span>
            ),
          },
          {
            key: "customer",
            header: "Customer",
            render: (row) => row.customer,
          },
          {
            key: "mealDescription",
            header: "Meal Description",
            render: (row) => row.mealDescription,
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {row.status}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openStatusModal(row)}
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
        rows={loading ? [] : orders}
        rowKey={(row) => row.id}
        emptyMessage={loading ? "Loading orders..." : "No orders found."}
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
              form="order-form"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Save Status
            </button>
          </div>
        }
      >
        <form id="order-form" className="space-y-4" onSubmit={handleSaveStatus}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Order
            </span>
            <input
              value={selectedOrder?.id ?? ""}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as OrderStatus)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </form>
      </Modal>
    </section>
  );
};
