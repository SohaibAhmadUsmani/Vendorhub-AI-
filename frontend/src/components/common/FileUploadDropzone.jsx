import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function FileUploadDropzone({
  onUploadSuccess,
  label = "Upload Image / Document",
  accept = "image/*,application/pdf",
  multiple = false,
  maxSizeMB = 10
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    setErrorMsg(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      const fileUrl = json.url || json.data?.url || (json.filename ? `http://localhost:5000/uploads/${json.filename}` : null);

      if (fileUrl) {
        setPreview(fileUrl);
        if (onUploadSuccess) onUploadSuccess(fileUrl);
      }
    } catch (err) {
      console.warn('API Upload failed, creating local object preview:', err);
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      if (onUploadSuccess) onUploadSuccess(localUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
        {label}
      </label>

      {preview ? (
        <div className="relative group rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-900 h-32 flex items-center justify-center">
          {preview.match(/\.(jpeg|jpg|gif|png|webp)$/i) || preview.startsWith('blob:') || preview.startsWith('http') ? (
            <img src={preview} alt="Upload preview" className="w-full h-full object-contain" />
          ) : (
            <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
              <FileText className="w-6 h-6 text-purple-400" />
              <span>Document File Uploaded</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => { setPreview(null); if (onUploadSuccess) onUploadSuccess(''); }}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-[#6C5CE7] bg-purple-500/10'
              : 'border-slate-300 dark:border-slate-800 hover:border-[#6C5CE7] bg-slate-50 dark:bg-[#0B1021]/50'
          }`}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-[#6C5CE7] flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {uploading ? "Uploading file..." : "Drag & drop file here or click to browse"}
            </p>
            <p className="text-[10px] font-mono text-slate-400">
              Supports JPEG, PNG, WEBP, PDF up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-red-500 flex items-center gap-1 font-mono">
          <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
        </p>
      )}
    </div>
  );
}
