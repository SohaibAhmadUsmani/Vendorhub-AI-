import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Shield, Ban, Edit, CheckCircle } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "buyer", status: "active", joined: "2023-10-15" },
    { id: 2, name: "Jane Smith", email: "jane@acmecorp.com", role: "vendor", status: "active", joined: "2023-11-02" },
    { id: 3, name: "Admin User", email: "admin@vendorhub.ai", role: "admin", status: "active", joined: "2023-01-10" },
    { id: 4, name: "Suspended Buyer", email: "baduser@example.com", role: "buyer", status: "suspended", joined: "2024-01-20" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  const handleEdit = (userId) => {
    alert(`Edit User modal would open for User ID: ${userId}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold">
                        {user.name.charAt(0)}
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
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{user.joined}</td>
                  <td className="py-4 px-6">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400"><CheckCircle className="h-4 w-4" /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400"><Ban className="h-4 w-4" /> Suspended</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(user.id)} className="p-2 text-gray-400 hover:text-purple-600 transition-colors" title="Edit User">
                        <Edit className="h-4 w-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button onClick={() => toggleUserStatus(user.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Suspend User">
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button onClick={() => toggleUserStatus(user.id)} className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Reactivate User">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
