import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Shield, Bell, Key, CreditCard, Save, ExternalLink } from "lucide-react";
import { fetchMyVendorProfile, updateVendorProfile } from "../services/vendorService";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("buyer");
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState({ name: "", email: "" });
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function initSettings() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          setUserProfile({ name: storedUser.name, email: storedUser.email });
          if (storedUser.role) {
            const userRole = String(storedUser.role).toLowerCase();
            setRole(userRole);
            
            if (userRole === "vendor") {
              const vendor = await fetchMyVendorProfile();
              if (vendor) {
                setVendorData(vendor);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    initSettings();
  }, []);

  const getTabs = () => {
    const baseTabs = [
      { id: "profile", label: "Profile & Account", icon: User },
      { id: "security", label: "Security & 2FA", icon: Shield },
      { id: "notifications", label: "Notifications", icon: Bell },
    ];
    if (role === "vendor") {
      baseTabs.push({ id: "api", label: "API & Integrations", icon: Key });
    } else if (role === "buyer") {
      baseTabs.push({ id: "billing", label: "Payment Methods", icon: CreditCard });
    } else if (role === "admin") {
      baseTabs.push({ id: "api", label: "Platform Integrations", icon: Key });
    }
    return baseTabs;
  };

  const tabs = getTabs();

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      if (role === 'vendor' && vendorData) {
        await updateVendorProfile(vendorData.id, vendorData);
      }
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your account preferences and configurations
          </p>
        </div>
        <button className="btn-purple-primary flex items-center justify-center gap-2 w-full md:w-auto">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="card-surface p-1">
        <div className="flex overflow-x-auto hide-scrollbar gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-hover"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-surface p-6">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" defaultValue={userProfile.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input type="email" className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" defaultValue={userProfile.email} />
              </div>
              
              {role === "vendor" && vendorData && (
                <div className="md:col-span-2 space-y-6">
                  <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                    <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4">Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                        <input type="text" className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 text-gray-900 dark:text-white" value={vendorData.name} onChange={(e) => setVendorData({...vendorData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <input type="text" className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 text-gray-900 dark:text-white" value={vendorData.location} onChange={(e) => setVendorData({...vendorData, location: e.target.value})} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Overview</label>
                        <textarea className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 text-gray-900 dark:text-white" rows="3" value={vendorData.overview} onChange={(e) => setVendorData({...vendorData, overview: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-lg justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">Manage Vendor Profile</h4>
                      <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Update your catalog, certifications, facility details, and branding.</p>
                    </div>
                    <button 
                      onClick={() => navigate('/vendor/profile', { state: { editMode: true } })}
                      className="btn-purple-primary flex items-center gap-2 text-sm px-4 py-2"
                    >
                      <ExternalLink className="h-4 w-4" /> Edit Public Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-dark-border">
              {saveMessage && <span className="text-sm font-medium text-green-600">{saveMessage}</span>}
              <button onClick={handleSaveProfile} disabled={isSaving} className="btn-purple-primary flex items-center justify-center gap-2">
                <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Password & Authentication</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input type="password" placeholder="Enter current password" className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
              </div>
              <div className="pt-2">
                <button onClick={() => alert("Password update request sent to backend!")} className="btn-purple-primary w-full md:w-auto">Update Password</button>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account.</p>
                </div>
                <button 
                  className="btn-outline-secondary"
                  onClick={() => alert("OTP Verification Modal Triggered: Scan QR Code and enter 6-digit pin")}
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {['New RFQ Received', 'Quote Accepted', 'Order Shipped', 'New Message'].map((item) => (
                <div key={item} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">API Keys & Webhooks</h2>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-400">Keep your API keys secure. Do not expose them in public repositories.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Secret Key</label>
              <div className="flex gap-2">
                <input type="password" value="sk_live_1234567890abcdef" readOnly className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2 text-gray-900 dark:text-white" />
                <button className="btn-outline-secondary whitespace-nowrap">Reveal Key</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "billing" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Methods</h2>
            <div className="border border-gray-200 dark:border-dark-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-16 bg-gray-100 dark:bg-dark-hover rounded-md flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Visa ending in 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/24</p>
                </div>
              </div>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">Edit</button>
            </div>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">+ Add new payment method</button>
          </div>
        )}
      </div>
    </div>
  );
}
