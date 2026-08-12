import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Shield, Ban, Edit, CheckCircle } from "lucide-react";
import api from "../services/httpClient";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const res = await api.put(`/api/users/${userId}/status`, { status: newStatus });
      if (res.data.success) {
        setUsers(users.map(user => 
          user._id === userId 
            ? { ...user, status: newStatus }
            : user
        ));
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status.");
    }
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find(u => u._id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setEditFormData({ name: userToEdit.name, role: userToEdit.role });
      setShowEditModal(true);
    }
  };

  const submitEdit = async () => {
    try {
      const res = await api.put(`/api/users/${selectedUser._id}`, editFormData);
      if (res.data.success) {
        setUsers(users.map(u => u._id === selectedUser._id ? res.data.data : u));
        setShowEditModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage platform users, roles, and account statuses
          </p>
        </div>
      </div>

      <div className="card-surface p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="buyer">Buyers</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-hover/50">
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">User</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      user.role === 'vendor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400"><CheckCircle className="h-4 w-4" /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400"><Ban className="h-4 w-4" /> Suspended</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(user._id)} className="p-2 text-gray-400 hover:text-purple-600 transition-colors" title="Edit User">
                        <Edit className="h-4 w-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button onClick={() => toggleUserStatus(user._id, user.status)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Suspend User">
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button onClick={() => toggleUserStatus(user._id, user.status)} className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Reactivate User">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 dark:text-white"
                  value={editFormData.name}
                  onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select 
                  className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 dark:text-white"
                  value={editFormData.role}
                  onChange={e => setEditFormData({...editFormData, role: e.target.value})}
                >
                  <option value="buyer">Buyer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-hover rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={submitEdit}
                className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
