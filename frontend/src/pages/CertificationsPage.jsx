import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Plus, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import DashboardEmptyState from "../components/dashboard/DashboardEmptyState";
import { fetchMyVendorProfile } from "../services/vendorService";

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const vendor = await fetchMyVendorProfile();
        if (vendor && vendor.certifications) {
          setCertifications(vendor.certifications);
        }
      } catch (err) {
        console.error("Failed to load certifications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3 h-3" /> Verified</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="w-3 h-3" /> Pending</span>;
      case "expired":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3" /> Expired</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Certifications
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your compliance documents and quality standards
          </p>
        </div>
        <button className="btn-purple-primary flex items-center justify-center gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" /> Upload Certification
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading certifications...</div>
      ) : (
        <div className="card-surface overflow-hidden">
        {certifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-hover/50">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Certification Name</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Issuing Body</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Issue Date</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Expiry Date</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {certifications.map((cert) => (
                  <tr key={cert.id || cert.title || cert.name} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{cert.title || cert.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{cert.issueDate || "N/A"}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{cert.validUntil || cert.expiryDate || "N/A"}</td>
                    <td className="py-4 px-6">{getStatusBadge(cert.status || "verified")}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">View Document</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <DashboardEmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No Certifications Found"
            hint="Upload your ISO, CE, or other compliance certificates to build trust with buyers."
            action={{ label: "Upload First Certificate" }}
          />
        )}
      </div>
      )}
    </div>
  );
}
