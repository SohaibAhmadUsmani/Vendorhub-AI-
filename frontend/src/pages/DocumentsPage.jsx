import React, { useEffect, useRef, useState } from "react";

import {
  getDocuments,
  uploadDocument,
  generateDocumentSummary,
  deleteDocument,
  aiSearchDocuments,
  searchDocuments,
} from "../services/documentService";

const documentTypes = [
  { value: "contract", label: "Contract" },
  { value: "certification", label: "Certification" },
  { value: "purchase_order", label: "Purchase Order" },
  { value: "invoice", label: "Invoice" },
  { value: "shipping_document", label: "Shipping Document" },
];

const typeIcons = {
  contract: "📝",
  certification: "🎓",
  purchase_order: "📋",
  invoice: "🧾",
  shipping_document: "🚚",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [filteredCount, setFilteredCount] = useState(null);

  // Upload form state
  const [name, setName] = useState("");
  const [type, setType] = useState("contract");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchInsight, setSearchInsight] = useState("");
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [aiSearching, setAiSearching] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(null);
  const [notice, setNotice] = useState(null);

  const fileInputRef = useRef(null);
  const searchTimerRef = useRef(null);

  const showNotice = (message, kind = "success") => {
    setNotice({ message, kind });
    window.setTimeout(() => setNotice(null), 4000);
  };

  // --------------------------------------------------
  // LOAD DOCUMENTS
  // --------------------------------------------------
  const loadDocuments = async () => {
    try {
      setLoadingDocuments(true);

      const result = await getDocuments();
      setDocuments(result.data || []);
      setFilteredCount(null);
    } catch (error) {
      console.error("Load documents error:", error);
      showNotice(error.message, "error");
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
      showNotice("Please enter document name.", "error");
      return;
    }

    if (!file) {
      showNotice("Please select a file.", "error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("type", type);
      if (description.trim()) formData.append("description", description.trim());
      if (tags.trim()) formData.append("tags", tags.trim());

      formData.append("file", file);

      await uploadDocument(formData);

      showNotice("Document uploaded successfully.");

      // Reset form
      setName("");
      setType("contract");
      setDescription("");
      setTags("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadDocuments();
    } catch (error) {
      console.error("Upload document error:", error);
      showNotice(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SEARCH (debounced AI search with keyword fallback)
  // --------------------------------------------------
  const runSearch = async (query, typeFilter) => {
    if (!query.trim()) {
      setSearchInsight("");
      setSearchKeywords([]);
      setFilteredCount(null);
      await loadDocuments();
      return;
    }

    setAiSearching(true);

    try {
      const result = await aiSearchDocuments(query.trim(), typeFilter || undefined);
      setDocuments(result.data || []);
      setFilteredCount(result.count ?? (result.data || []).length);
      setSearchInsight(result.insight || "");
      setSearchKeywords(result.keywords || []);
    } catch (error) {
      console.warn("AI search failed, falling back to keyword search:", error);
      try {
        const fallback = await searchDocuments(query.trim(), typeFilter || undefined);
        setDocuments(fallback.data || []);
        setFilteredCount(fallback.count ?? (fallback.data || []).length);
        setSearchInsight("");
        setSearchKeywords([]);
      } catch (fallbackError) {
        console.error("Search error:", fallbackError);
        showNotice(fallbackError.message, "error");
      }
    } finally {
      setAiSearching(false);
    }
  };

  useEffect(() => {
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = window.setTimeout(() => {
      runSearch(searchQuery, searchType);
    }, 500);

    return () => {
      if (searchTimerRef.current) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery, searchType]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchType("");
  };

  // --------------------------------------------------
  // AI SUMMARY
  // --------------------------------------------------
  const handleGenerateSummary = async (documentId) => {
    try {
      setSummaryLoading(documentId);

      await generateDocumentSummary(documentId);

      showNotice("AI summary generated successfully.");

      await runSearch(searchQuery, searchType);
    } catch (error) {
      console.error("AI summary error:", error);
      showNotice(error.message, "error");
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
      await deleteDocument(documentId);
      showNotice("Document deleted successfully.");

      await runSearch(searchQuery, searchType);
    } catch (error) {
      console.error("Delete document error:", error);
      showNotice(error.message, "error");
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

  const formatSize = (size) => {
    if (!size && size !== 0) return null;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
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

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upload, manage and AI-search your procurement documents.
          </p>
        </div>
      </div>

      {/* Notice */}
      {notice && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold ${
            notice.kind === "error"
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {notice.message}
        </div>
      )}

      {/* Upload Card */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#17142F]">
            Upload Document
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description{" "}
              <span className="font-normal text-slate-500">(optional)</span>
            </label>

            <input
              type="text"
              placeholder="e.g. ISO 9001 certificate, valid until 2027"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Tags{" "}
              <span className="font-normal text-slate-500">(optional, comma separated)</span>
            </label>

            <input
              type="text"
              placeholder="e.g. ISO, quality, 2026"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10"
            />
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
              <p className="mt-2 text-xs text-slate-600">
                Selected:{" "}
                <span className="font-semibold text-[#6C63FF]">
                  {file.name}
                </span>
                {formatSize(file.size) && (
                  <span className="text-slate-500">
                    {" "}({formatSize(file.size)})
                  </span>
                )}
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

      {/* Search Card */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#17142F]">
            AI Document Search
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Ask in plain language, e.g. "find certificates that expire soon".
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            type="text"
            placeholder="Search documents with AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10"
          />

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10 lg:w-56"
          >
            <option value="">All Types</option>
            {documentTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>

        {aiSearching && (
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            AI is searching...
          </p>
        )}

        {!aiSearching && searchKeywords.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">AI keywords:</span>
            {searchKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-[#6C63FF]/10 px-2 py-1 text-xs font-semibold text-[#6C63FF]"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {searchInsight && (
          <div className="mt-4 rounded-xl bg-[#F7F5FF] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#6C63FF]">
              AI Insight
            </p>

            <p className="text-sm leading-6 text-gray-700">
              {searchInsight}
            </p>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#17142F]">
              Your Documents
            </h2>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {filteredCount !== null
                ? `${filteredCount} result${filteredCount !== 1 ? "s" : ""} for "${searchQuery}"`
                : `${documents.length} document${documents.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loadingDocuments && (
          <div className="py-12 text-center text-sm text-slate-600 dark:text-slate-400">
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
              {searchQuery ? "No matching documents" : "No documents found"}
            </h3>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {searchQuery
                ? "Try a different search phrase or clear the filters."
                : "Upload your first procurement document above."}
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
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                  {/* Info */}
                  <div className="flex min-w-0 items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-2xl">
                      {typeIcons[document.type] || "📄"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-[#17142F]">
                        {document.name}
                      </h3>

                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="rounded-full bg-gray-100 px-2 py-1">
                          {getTypeLabel(document.type)}
                        </span>

                        {document.fileName && (
                          <span className="rounded-full bg-gray-100 px-2 py-1">
                            {document.fileName}
                          </span>
                        )}

                        {formatSize(document.size) && (
                          <span className="rounded-full bg-gray-100 px-2 py-1">
                            {formatSize(document.size)}
                          </span>
                        )}

                        <span className="self-center">
                          {formatDate(document.createdAt)}
                        </span>
                      </div>

                      {document.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {document.description}
                        </p>
                      )}

                      {document.tags?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {document.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-[#6C63FF]/5 px-2 py-0.5 text-xs text-[#6C63FF]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* AI Summary */}
                      {document.summary && (
                        <div className="mt-4 rounded-xl bg-[#F7F5FF] p-4">
                          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#6C63FF]">
                            AI Summary
                          </p>

                          <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                            {document.summary}
                          </p>

                          {document.summaryKeyPoints?.length > 0 && (
                            <ul className="mt-3 space-y-1.5">
                              {document.summaryKeyPoints.map((point, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm text-gray-700"
                                >
                                  <span className="mt-0.5 text-[#6C63FF]">
                                    ✓
                                  </span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {document.summaryConcerns?.length > 0 && (
                            <ul className="mt-3 space-y-1.5">
                              {document.summaryConcerns.map((concern, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm text-amber-700"
                                >
                                  <span className="mt-0.5">
                                    ⚠
                                  </span>
                                  <span>{concern}</span>
                                </li>
                              ))}
                            </ul>
                          )}
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
