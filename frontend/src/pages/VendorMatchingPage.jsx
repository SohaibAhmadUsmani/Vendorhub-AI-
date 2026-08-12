import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Factory, Package, DollarSign, Award, Clock, Truck, ShieldCheck } from 'lucide-react';
import MatchScoreCard from '../components/matching/MatchScoreCard';

const mockVendors = [
  { id: 1, name: 'Alpha Textiles Ltd.', price: 8, quality: 9, deliveryTime: 7, reviews: 9, location: 9, capacity: 8, certifications: 10, pastPerformance: 8 },
  { id: 2, name: 'Beta Manufacturing Co.', price: 6, quality: 8, deliveryTime: 9, reviews: 7, location: 6, capacity: 9, certifications: 7, pastPerformance: 9 },
  { id: 3, name: 'Gamma Global Suppliers', price: 9, quality: 6, deliveryTime: 6, reviews: 8, location: 7, capacity: 7, certifications: 6, pastPerformance: 7 },
];

const weights = {
  price: 0.15, quality: 0.2, deliveryTime: 0.15, reviews: 0.15,
  location: 0.1, capacity: 0.1, certifications: 0.1, pastPerformance: 0.05,
};

function scoreVendors(vendors) {
  return vendors
    .map((v) => {
      const score = Object.keys(weights).reduce((sum, key) => sum + v[key] * weights[key], 0);
      return { ...v, matchScore: Math.round(score * 10) };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export default function VendorMatchingPage() {
  const [requirement, setRequirement] = useState('');
  const [results, setResults] = useState(scoreVendors(mockVendors));
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResults(scoreVendors(mockVendors));
      setLoading(false);
    }, 600);
  };

  const filters = [
    { name: "Country", icon: MapPin },
    { name: "Industry", icon: Factory },
    { name: "MOQ", icon: Package },
    { name: "Price", icon: DollarSign },
    { name: "Certifications", icon: Award },
    { name: "Lead Time", icon: Clock },
    { name: "Capacity", icon: Package },
    { name: "Shipping", icon: Truck }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
            AI Supplier Search
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Describe your requirements in natural language and let AI find the best matches
          </p>
        </div>
      </div>

      <div className="card-surface p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="e.g. Need 10,000 cotton T-shirts manufactured in Pakistan with ISO certification"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline-secondary px-4 flex items-center justify-center"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-purple-primary px-8 whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Find Vendors'}
            </button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-100 dark:border-dark-border grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <div key={filter.name}>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                      <Icon className="h-3.5 w-3.5" />
                      {filter.name}
                    </label>
                    <select className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:text-gray-300">
                      <option value="">Any</option>
                      <option value="specific">Specific {filter.name}</option>
                    </select>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          Verified AI Matches
        </h2>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Analyzing requirements and ranking suppliers...</p>
        ) : (
          <div className="grid gap-4">
            {results.map((vendor) => (
              <MatchScoreCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}