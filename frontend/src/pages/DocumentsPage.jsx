import React, { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:5000/api/documents";

const documentTypes = [
  { value: "contract", label: "Contract" },
  { value: "certification", label: "Certification" },
  { value: "purchase_order", label: "Purchase Order" },
  { value: "invoice", label: "Invoice" },
  { value: "shipping_document", label: "Shipping Document" },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);

  const [name, setName] = useState("");
  const [type, setType] = useState("contract");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(null);

  const fileInputRef = useRef(null);

  // --------------------------------------------------
  // LOAD DOCUMENTS
  // --------------------------------------------------
  const loadDocuments = async () => {
    try {
      setLoadingDocuments(true);

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load documents");
      }

      setDocuments(result.data || []);
    } catch (error) {
      console.error("Load documents error:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // --------------------------------------------------
  // UPLOAD DOCUMENT
  // --------------------------------------------------
  const handleAddDocument = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter document name.");
      return;
    }

    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("type", type);
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Document upload failed");
      }

      alert("Document uploaded successfully.");

      // Reset form
      setName("");
      setType("contract");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadDocuments();
    } catch (error) {
      console.error("Upload document error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // AI SUMMARY
  // --------------------------------------------------
  const handleGenerateSummary = async (documentId) => {
    try {
      setSummaryLoading(documentId);

      const response = await fetch(
        `${API_URL}/${documentId}/summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate summary");
      }

      alert("AI summary generated successfully.");

      await loadDocuments();
    } catch (error) {
      console.error("AI summary error:", error);
      alert(error.message);
    } finally {
      setSummaryLoading(null);
    }
  };

  // --------------------------------------------------
  // DELETE DOCUMENT
  // --------------------------------------------------
  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${documentId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete document");
      }

      await loadDocuments();
    } catch (error) {
      console.error("Delete document error:", error);
      alert(error.message);
    }
  };

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------
  const getTypeLabel = (value) => {
    const item = documentTypes.find((doc) => doc.value === value);
    return item ? item.label : value;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8F8FC] p-6 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#17142F]">
            Documents
          </h1>

          <p className="text-sm text-gray-500">
            Upload, manage and analyze your procurement documents
            with AI.
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#17142F]">
            Upload Document
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Upload contracts, certifications, purchase orders,
            invoices or shipping documents.
          </p>
        </div>

        <form
          onSubmit={handleAddDocument}
          className="grid gap-4 md:grid-cols-2"
        >

          {/* Document Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Document Name
            </label>

            <input
              type="text"
              placeholder="e.g. Supplier Contract"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10"
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Document Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10"
            >
              {documentTypes.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* File */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Select File
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                setFile(selectedFile);
              }}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
            />

            {file && (
              <p className="mt-2 text-xs text-gray-500">
                Selected:{" "}
                <span className="font-semibold text-[#6C63FF]">
                  {file.name}
                </span>
              </p>
            )}
          </div>

          {/* Upload Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#6C63FF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5A4AE8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>

      {/* Documents List */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#17142F]">
              Your Documents
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {documents.length} document
              {documents.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loadingDocuments && (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading documents...
          </div>
        )}

        {/* Empty */}
        {!loadingDocuments && documents.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
            <div className="mb-3 text-4xl">
              📄
            </div>

            <h3 className="font-semibold text-gray-700">
              No documents found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Upload your first procurement document above.
            </p>
          </div>
        )}

        {/* Documents */}
        {!loadingDocuments && documents.length > 0 && (
          <div className="space-y-4">

            {documents.map((document) => (
              <div
                key={document._id}
                className="rounded-2xl border border-gray-200 p-5 transition hover:border-[#6C63FF]/40 hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  {/* Info */}
                  <div className="flex min-w-0 items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-2xl">
                      📄
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-[#17142F]">
                        {document.name}
                      </h3>

                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-gray-100 px-2 py-1">
                          {getTypeLabel(document.type)}
                        </span>

                        {document.fileName && (
                          <span className="rounded-full bg-gray-100 px-2 py-1">
                            {document.fileName}
                          </span>
                        )}

                        <span>
                          {formatDate(document.createdAt)}
                        </span>
                      </div>

                      {/* AI Summary */}
                      {document.summary && (
                        <div className="mt-4 rounded-xl bg-[#F7F5FF] p-4">
                          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#6C63FF]">
                            AI Summary
                          </p>

                          <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                            {document.summary}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap gap-2">

                    {document.fileUrl && (
                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        View
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleGenerateSummary(document._id)
                      }
                      disabled={summaryLoading === document._id}
                      className="rounded-lg bg-[#6C63FF] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5A4AE8] disabled:opacity-60"
                    >
                      {summaryLoading === document._id
                        ? "Analyzing..."
                        : "AI Summary"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(document._id)
                      }
                      className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}