import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2 } from 'lucide-react';
import FileUploadDropzone from '../common/FileUploadDropzone';
import { updateVendorProfile } from '../../services/vendorService';

export default function UploadCertificationModal({ isOpen, onClose, vendor, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    validUntil: '',
    registrationNumber: ''
  });
  
  const [fileUrl, setFileUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUploaded = (urls) => {
    if (urls && urls.length > 0) {
      setFileUrl(urls[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendor) return;
    
    setIsSubmitting(true);
    
    const newCert = {
      ...formData,
      fileUrl,
      status: 'pending' // Default status
    };
    
    // Add to existing certifications
    const existingCerts = vendor.certifications || [];
    const updatedVendorData = {
      certifications: [...existingCerts, newCert]
    };
    
    try {
      const updatedVendor = await updateVendorProfile(vendor.id || vendor._id, updatedVendorData);
      if (onUploadSuccess) {
        onUploadSuccess(updatedVendor);
      }
      onClose();
      // Reset form
      setFormData({ title: '', issuer: '', issueDate: '', validUntil: '', registrationNumber: '' });
      setFileUrl(null);
    } catch (err) {
      console.error('Failed to upload certification:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#1E1B33] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[var(--primary-purple)]" />
            Upload Certification
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Certification Title *</label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. ISO 9001:2015"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-purple)]/50 focus:border-[var(--primary-purple)] outline-none transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issuer *</label>
              <input 
                required
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                placeholder="e.g. SGS"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-purple)]/50 focus:border-[var(--primary-purple)] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Registration Number</label>
              <input 
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-purple)]/50 focus:border-[var(--primary-purple)] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issue Date</label>
              <input 
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-purple)]/50 focus:border-[var(--primary-purple)] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Valid Until *</label>
              <input 
                required
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-purple)]/50 focus:border-[var(--primary-purple)] outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Document</label>
            <FileUploadDropzone 
              onUploadSuccess={handleFileUploaded} 
              maxFiles={1} 
              acceptedTypes={["image/jpeg", "image/png", "application/pdf"]} 
            />
            {fileUrl && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Document attached successfully.
              </p>
            )}
          </div>
          
          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--primary-purple)] rounded-xl hover:bg-[#5b4fbe] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Submit Certification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
