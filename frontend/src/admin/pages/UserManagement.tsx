import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { Modal } from "../components/ui/Modal.tsx";
import { Table } from "../components/ui/Table.tsx";
import { adminApi } from "../services/adminApi.ts";
import type { User, UserRole } from "../types/index.ts";

const roleOptions: UserRole[] = ["Chef", "Customer", "Admin"];

const initialForm = {
  full_name: "",
  email: "",
  password: "",
  role: "Customer" as UserRole,
};

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formState, setFormState] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const modalTitle = useMemo(
    () => (editingUser ? "Edit User" : "Add New User"),
    [editingUser],
  );

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const data = await adminApi.getUsers();
        setUsers(data);
      } catch (err: any) {
        setFetchError(
          err.response?.data?.error ||
            "Unable to load users. Please refresh or sign in again.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const chefs = useMemo(
    () => users.filter((user) => user.role === "Chef"),
    [users],
  );
  const customers = useMemo(
    () => users.filter((user) => user.role === "Customer"),
    [users],
  );
  const admins = useMemo(
    () => users.filter((user) => user.role === "Admin"),
    [users],
  );

  const openCreateModal = () => {
    setError(null);
    setEditingUser(null);
    setFormState(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormState({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormState(initialForm);
    setError(null);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (editingUser) {
      try {
        const updated = await adminApi.updateUser(editingUser.uid, {
          full_name: formState.full_name,
          email: formState.email,
          role: formState.role,
        });

        setUsers((prev) =>
          prev.map((user) => (user.uid === updated.uid ? updated : user)),
        );
        closeModal();
      } catch (err: any) {
        setError(
          err.response?.data?.error || err.message ||
            "Unable to update user. Please try again.",
        );
      }
    } else {
      try {
        const created = await adminApi.createUser(formState);
        setUsers((prev) => [created, ...prev]);
        closeModal();
      } catch (err: any) {
        setError(
          err.response?.data?.error || err.message ||
            "Unable to create user. Please try again.",
        );
      }
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.uid !== userId));
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Unable to delete user. Please try again.",
      );
    }
  };

  const columns = [
    {
      key: "uid",
      header: "UUID",
      render: (row: User) => (
        <span className="font-mono text-xs text-slate-600">{row.uid}</span>
      ),
    },
    {
      key: "full_name",
      header: "Full Name",
      render: (row: User) => row.full_name,
    },
    { key: "email", header: "Email", render: (row: User) => row.email },
    {
      key: "actions",
      header: "Actions",
      className: "w-[120px]",
      render: (row: User) => (
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
            onClick={() => handleDelete(row.uid)}
            className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const userSection = (title: string, rows: User[]) => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
        {title} ({rows.length})
      </h4>
      <Table
        columns={columns}
        rows={loading ? [] : rows}
        rowKey={(row) => row.uid}
        emptyMessage={loading ? "Loading users..." : `No ${title.toLowerCase()} found.`}
      />
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Users</h3>
          <p className="text-sm text-slate-500">
            Manage chefs, customers, and administrators.
          </p>
          {fetchError ? (
            <p className="mt-2 text-sm text-rose-600">{fetchError}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <FiPlus />
          Add New User
        </button>
      </div>

      {userSection("Chefs", chefs)}
      {userSection("Customers", customers)}
      {admins.length > 0 ? userSection("Administrators", admins) : null}

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
              form="user-form"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {editingUser ? "Save Changes" : "Create User"}
            </button>
          </div>
        }
      >
        <form id="user-form" className="space-y-4" onSubmit={handleSave}>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </span>
            <input
              type="text"
              value={formState.full_name}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  full_name: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              type="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, email: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              required
            />
          </label>

          {!editingUser ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                required
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </span>
            <select
              value={formState.role}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  role: event.target.value as UserRole,
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </form>
      </Modal>
    </section>
  );
};
