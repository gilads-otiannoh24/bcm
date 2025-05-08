"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Download,
  Filter,
  Plus,
  X,
} from "lucide-react";
import { UserEditModal } from "../../components/Admin";
import { ConfirmModal } from "../../components/Admin";
import api from "../../lib/axios";
import Loading from "../../components/Loading";
import { User } from "@shared/types";
import useToastStore from "../../hooks/useToast";
import { UserCreateModal } from "../../components/Admin/user-create-modal";
import { downloadPdf } from "../../lib/pdf-generator.util";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { toast } = useToastStore();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("/users");

        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle select all users
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  // Handle select individual user
  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Handle user edit
  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  // Handle user delete
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Handle save user edit
  const handleSaveUser = async (
    updatedUser: User,
    sendPasswordResetmail: boolean = false
  ) => {
    try {
      const response = await api.patch(`/users/${updatedUser.id}`, {
        ...updatedUser,
        sendPasswordResetmail,
      });

      if (response.data.success) {
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        toast.success("User details updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update user details!");
    } finally {
      setIsEditModalOpen(false);
      setUserToEdit(null);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await api.delete(`/users/${userToDelete.id}`);

      if (response.data.success) {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setSelectedUsers(selectedUsers.filter((id) => id !== userToDelete.id));
        toast.success("User deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete user!");
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!selectedUsers.length) return;
    try {
      const response = await api.post(`/users/deletebulk`, {
        ids: selectedUsers,
      });

      if (response.data.success) {
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        toast.success("Users deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting users");
    } finally {
      setSelectedUsers([]);
      setIsAllSelected(false);
    }
  };

  const getSelectedUsersDataSetForExport = (): User[] | [] => {
    if (!selectedUsers) return [];
    return selectedUsers.map((id) => {
      let user = users.find((user) => user.id === id) as User;

      const keysToRemove = [
        "_id",
        "__v",
        "firstName",
        "lastName",
        "resetPasswordToken",
        "resetPasswordExpire",
        "avatar",
        "id",
      ];
      const userToExport = Object.keys(user).reduce((acc, key) => {
        if (!keysToRemove.includes(key)) {
          // @ts-ignore
          acc[key] = user[key as keyof User];
        }
        return acc;
      }, {});

      return userToExport;
    }) as User[];
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <a
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </a>
      </div>

      {/* Filters */}
      <div className="bg-base-100 p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow h-fit">
            <Search className="absolute z-[1] left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute z[1] right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4 text-base-content/50" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="select select-bordered"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="premium">Premium</option>
              <option value="user">User</option>
            </select>

            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>

            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-1" />
              Reset
            </button>
          </div>
        </div>

        {/* Selected users actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-2 bg-base-200 rounded-lg">
            <span className="text-sm">
              {selectedUsers.length} user{selectedUsers.length !== 1 && "s"}{" "}
              selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  downloadPdf(
                    getSelectedUsersDataSetForExport(),
                    "bcm-admin-users-download.pdf",
                    "BCM Users"
                  )
                }
                className="btn btn-sm btn-outline"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-base-100 rounded-lg shadow-md overflow-x-auto">
        {isLoading ? (
          <>
            <div className="flex items-center justify-center h-full py-12">
              <Loading />
            </div>
          </>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Cards</th>
                  <th>Created On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="bg-primary text-neutral-content rounded-full w-10">
                            <span className="text-xl h-full flex font-bold items-center justify-center">
                              {user?.fullName?.[0]?.toUpperCase() || "B"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.fullName}</div>
                          <div className="text-sm opacity-50">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge ${
                          user.role === "admin"
                            ? "badge-primary"
                            : user.role === "premium"
                            ? "badge-secondary"
                            : "badge-ghost"
                        }`}
                      >
                        {user.role}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge ${
                          user.status === "active"
                            ? "badge-success"
                            : user.status === "inactive"
                            ? "badge-warning"
                            : "badge-ghost"
                        }`}
                      >
                        {user.status}
                      </div>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>{user.cards}</td>
                    <td>{user.createdAt}</td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-xs"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                          <li>
                            <button onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                          </li>
                          <li>
                            <button onClick={() => handleDeleteUser(user)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <span className="text-sm">
                Showing {indexOfFirstUser + 1} to{" "}
                {indexOfLastUser > filteredUsers.length
                  ? filteredUsers.length
                  : indexOfLastUser}{" "}
                of {filteredUsers.length} users
              </span>
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`join-item btn btn-sm ${
                      currentPage === i + 1 ? "btn-active" : ""
                    }`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn btn-sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && userToEdit && (
        <UserEditModal
          user={userToEdit}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete the user ${userToDelete.fullName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="btn-error"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}

      {/* create modal */}
      {isCreateModalOpen && (
        <UserCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            toast.success("User created successfully");
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
