import React from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Factory, ShieldCheck, Mail, Bookmark, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getRoleRoute } from "../utils/routeUtils";

export default function SavedVendorsPage() {
  const savedVendors = [
    {
      id: "v1",
      name: "Industrial Dynamics Corp.",
      category: "Pipes & Fittings",
      location: "Germany",
      rating: 4.8,
      reviews: 124,
      aiScore: 96,
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format",
    },
    {
      id: "v2",
      name: "Apex Textiles Ltd.",
      category: "Apparel & Fabrics",
      location: "Vietnam",
      rating: 4.5,
      reviews: 89,
      aiScore: 88,
      logo: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=100&h=100&fit=crop&auto=format",
    },
    {
      id: "v3",
      name: "Global Steel Works",
      category: "Raw Materials",
      location: "India",
      rating: 4.9,
      reviews: 312,
      aiScore: 92,
      logo: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=100&h=100&fit=crop&auto=format",
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Saved Vendors
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Your shortlisted and favorite suppliers
          </p>
        </div>
      </div>

      <div className="card-surface p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search saved vendors..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none">
            <option value="all">All Categories</option>
            <option value="pipes">Pipes & Fittings</option>
            <option value="apparel">Apparel & Fabrics</option>
            <option value="raw">Raw Materials</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedVendors.map((vendor) => (
          <div key={vendor.id} className="card-surface p-6 flex flex-col hover:border-purple-300 dark:hover:border-purple-700/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <img src={vendor.logo} alt={vendor.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-dark-border" />
              <button className="text-purple-600 dark:text-purple-400 p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-colors" title="Remove from saved">
                <Bookmark className="h-5 w-5 fill-current" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{vendor.name}</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 gap-3">
              <span className="flex items-center gap-1"><Factory className="h-3.5 w-3.5" /> {vendor.category}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {vendor.location}</span>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-dark-border">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Match Score</span>
                <span className="font-bold text-green-600 dark:text-green-400">{vendor.aiScore}%</span>
              </div>
              <div className="flex gap-2">
                <Link to={getRoleRoute("messages")} state={{ recipientId: vendor.id, recipientName: vendor.name }} className="p-2 text-gray-500 hover:text-purple-600 bg-gray-50 dark:bg-dark-hover rounded-lg transition-colors">
                  <Mail className="h-4 w-4" />
                </Link>
                <Link to={`/buyer/vendors/${vendor.id}`} className="p-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-1">
                  <span className="text-sm font-medium px-1">Profile</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
