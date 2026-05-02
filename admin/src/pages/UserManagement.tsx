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

  const modalTitle = useMemo(
    () => (editingUser ? "Edit User" : "Add New User"),
    [editingUser],
  );

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);

      try {
        // TODO: Wire up Axios call here (fetch all users)
        const data = await adminApi.getUsers();
        setUsers(data);
      } catch {
        setUsers(adminApi.getMockUsers());
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const openCreateModal = () => {
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
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingUser) {
      // TODO: Wire up Axios call here (update user)
      try {
        const updated = await adminApi.updateUser(editingUser.uid, {
          full_name: formState.full_name,
          email: formState.email,
          role: formState.role,
        });

        setUsers((prev) =>
          prev.map((user) => (user.uid === updated.uid ? updated : user)),
        );
      } catch {
        setUsers((prev) =>
          prev.map((user) =>
            user.uid === editingUser.uid
              ? {
                  ...user,
                  full_name: formState.full_name,
                  email: formState.email,
                  role: formState.role,
                }
              : user,
          ),
        );
      }
    } else {
      // TODO: Wire up Axios call here (create user)
      try {
        const created = await adminApi.createUser(formState);
        setUsers((prev) => [created, ...prev]);
      } catch {
        setUsers((prev) => [
          {
            uid: crypto.randomUUID(),
            full_name: formState.full_name,
            email: formState.email,
            role: formState.role,
          },
          ...prev,
        ]);
      }
    }

    closeModal();
  };

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this user?",
    );

    if (!confirmed) {
      return;
    }

    // TODO: Wire up Axios call here (delete user)
    try {
      await adminApi.deleteUser(userId);
    } finally {
      setUsers((prev) => prev.filter((user) => user.uid !== userId));
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Users</h3>
          <p className="text-sm text-slate-500">
            Manage chefs, customers, and administrators.
          </p>
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

      <Table
        columns={[
          {
            key: "uid",
            header: "UUID",
            render: (row) => (
              <span className="font-mono text-xs text-slate-600">
                {row.uid}
              </span>
            ),
          },
          {
            key: "full_name",
            header: "Full Name",
            render: (row) => row.full_name,
          },
          { key: "email", header: "Email", render: (row) => row.email },
          {
            key: "role",
            header: "Role",
            render: (row) => (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {row.role}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            className: "w-[120px]",
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
                  onClick={() => handleDelete(row.uid)}
                  className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
                >
                  <FiTrash2 />
                </button>
              </div>
            ),
          },
        ]}
        rows={loading ? [] : users}
        rowKey={(row) => row.uid}
        emptyMessage={loading ? "Loading users..." : "No users found."}
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
              form="user-form"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {editingUser ? "Save Changes" : "Create User"}
            </button>
          </div>
        }
      >
        <form id="user-form" className="space-y-4" onSubmit={handleSave}>
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
