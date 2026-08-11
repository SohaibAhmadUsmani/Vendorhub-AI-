import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, CheckCircle, XCircle, FileText, Star } from "lucide-react";

export default function AdminVendorsPage() {
  const vendors = [
    { id: "v1", name: "Industrial Dynamics Corp.", status: "pending", submitted: "2024-02-14", complianceScore: 85 },
    { id: "v2", name: "Global Textiles Ltd.", status: "verified", submitted: "2023-11-20", complianceScore: 98 },
    { id: "v3", name: "Apex Manufacturing", status: "rejected", submitted: "2024-01-05", complianceScore: 42 }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Vendor Verification
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Review and approve supplier applications and compliance documents
          </p>
        </div>
      </div>

      <div className="card-surface p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none">
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-hover/50">
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Vendor Name</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Submitted</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Compliance Score</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                    {vendor.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{vendor.submitted}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-[100px]">
                        <div className={`h-2.5 rounded-full ${vendor.complianceScore > 80 ? 'bg-green-500' : vendor.complianceScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${vendor.complianceScore}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{vendor.complianceScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {vendor.status === 'verified' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                    {vendor.status === 'pending' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>}
                    {vendor.status === 'rejected' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3" /> Rejected</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-md transition-colors">
                        Review Docs
                      </button>
                      {vendor.status === 'pending' && (
                        <>
                          <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Approve">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Reject">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
