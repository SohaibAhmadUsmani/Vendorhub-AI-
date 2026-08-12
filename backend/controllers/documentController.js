const Document = require("../models/Document");
const { groqChat } = require("../services/groqClient");
const cloudinary = require("../config/cloudinary");
const Tesseract = require("tesseract.js");

const DOCUMENT_TYPES = [
  "contract",
  "certification",
  "purchase_order",
  "invoice",
  "shipping_document",
];

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "this", "that", "document",
  "agreement", "supplier", "vendor", "order", "contract", "invoice",
  "certification", "shipping", "purchase", "new", "our", "into", "are",
]);

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseTags = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((tag) => String(tag).trim())
      .filter(Boolean)
      .slice(0, 10);
  }
  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);
};

const deriveKeywords = (name, type, description, tags) => {
  const source = [name, type, description, ...parseTags(tags)]
    .filter(Boolean)
    .join(" ");

  const words = source
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));

  return [...new Set(words)].slice(0, 20);
};

// Get all documents (optional ?type= and ?q= filters)
const getDocuments = async (req, res) => {
  try {
    const { type, q } = req.query;
    const query = {};

    if (type && DOCUMENT_TYPES.includes(type)) {
      query.type = type;
    }

    if (q && String(q).trim()) {
      const pattern = new RegExp(escapeRegex(String(q).trim()), "i");
      query.$or = [
        { name: pattern },
        { fileName: pattern },
        { description: pattern },
        { summary: pattern },
        { tags: pattern },
        { keywords: pattern },
      ];
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single document
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create document record
const createDocument = async (req, res) => {
  try {
    const { name, type, description, tags } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Document name and type are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document file",
      });
    }

    const keywords = deriveKeywords(name, type, description, tags);

    let extractedText = "";
    if (req.file.mimetype.startsWith("image/")) {
      try {
        const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");
        extractedText = text;
      } catch (ocrError) {
        console.warn("OCR failed:", ocrError.message);
      }
    }

    const document = await Document.create({
      name: name.trim(),
      type,
      description: description || "",
      tags: parseTags(tags),
      keywords,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      size: req.file.size,
      cloudinaryId: req.file.filename,
      uploadedBy: req.user?.id,
      extractedText,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update AI summary
const updateDocumentSummary = async (req, res) => {
  try {
    const { summary } = req.body;

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { summary },
      { new: true, runValidators: true }
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete document (also removes the file from Cloudinary)
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (document.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(document.cloudinaryId, {
          resource_type: "raw",
          invalidate: true,
        });
      } catch (cloudError) {
        console.warn(
          "Cloudinary delete failed (continuing):",
          cloudError.message
        );
      }
    }

    await Document.findByIdAndDelete(document._id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate an AI summary using the document metadata
const generateDocumentSummary = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const prompt = `
You are a professional B2B procurement assistant.

Analyze the following document record and produce a concise business summary.

Document name: ${document.name}
Document type: ${document.type}
File name: ${document.fileName || "Not provided"}
Description: ${document.description || "Not provided"}
Tags: ${(document.tags || []).join(", ") || "None"}
Extracted Text (OCR): ${document.extractedText ? document.extractedText.slice(0, 2000) : "None"}

Return ONLY valid JSON with exactly this structure:
{
  "summary": "2-4 sentence business summary of this document",
  "keyPoints": ["3-5 important procurement points"],
  "concerns": ["any concerns or missing information (may be empty)"]
}
`;

    const raw = await groqChat(
      [{ role: "user", content: prompt }],
      {
        temperature: 0.3,
        response_format: { type: "json_object" },
        timeout: 30000,
      }
    );

    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      console.warn("AI summary JSON parse failed:", parseError.message);
    }

    const fallbackSummary = `This is a ${document.type.replace(/_/g, " ")} named "${document.name}". Analyze the file content directly for a full summary.`;

    document.summary =
      parsed.summary || raw.trim() || fallbackSummary;
    document.summaryKeyPoints = Array.isArray(parsed.keyPoints)
      ? parsed.keyPoints.map(String).filter(Boolean)
      : [];
    document.summaryConcerns = Array.isArray(parsed.concerns)
      ? parsed.concerns.map(String).filter(Boolean)
      : [];

    await document.save();

    res.status(200).json({
      success: true,
      message: "AI summary generated successfully",
      data: document,
    });
  } catch (error) {
    console.error("Document AI summary error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Keyword search across documents
const searchDocuments = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const { type } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const query = {};
    if (type && DOCUMENT_TYPES.includes(type)) {
      query.type = type;
    }

    const pattern = new RegExp(escapeRegex(q), "i");
    query.$or = [
      { name: pattern },
      { fileName: pattern },
      { description: pattern },
      { summary: pattern },
      { tags: pattern },
      { keywords: pattern },
      { type: pattern },
    ];

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      query: q,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// AI-powered search: Groq interprets the query into keywords,
// then matches documents and produces an insight summary.
const aiSearchDocuments = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const { type } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // 1. Ask Groq to extract search keywords from the natural-language query
    let keywords = [q];
    try {
      const keywordPrompt = `
You are a procurement document search assistant.

User query: "${q}"

Return ONLY valid JSON with exactly this structure:
{"keywords": ["up to 6 short search keywords"]}

The keywords will be used to find matching contracts, certifications, purchase orders, invoices, or shipping documents.
`;

      const keywordRaw = await groqChat(
        [{ role: "user", content: keywordPrompt }],
        {
          temperature: 0.2,
          response_format: { type: "json_object" },
          timeout: 30000,
        }
      );

      const parsed = JSON.parse(keywordRaw);
      if (Array.isArray(parsed.keywords)) {
        const cleaned = parsed.keywords
          .map((keyword) => String(keyword).trim())
          .filter(Boolean)
          .slice(0, 6);
        if (cleaned.length > 0) keywords = cleaned;
      }
    } catch (extractError) {
      console.warn("AI keyword extraction failed:", extractError.message);
    }

    // 2. Match documents against the extracted keywords
    const escaped = keywords.filter(Boolean).map(escapeRegex);
    const pattern = new RegExp(
      escaped.length ? escaped.join("|") : escapeRegex(q),
      "i"
    );

    const query = {
      $or: [
        { name: pattern },
        { fileName: pattern },
        { description: pattern },
        { summary: pattern },
        { tags: pattern },
        { keywords: pattern },
        { type: pattern },
      ],
    };
    if (type && DOCUMENT_TYPES.includes(type)) {
      query.type = type;
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // 3. Ask Groq for an insight about the matches (best effort)
    let insight = "";
    try {
      const context = documents
        .slice(0, 10)
        .map(
          (doc) =>
            `- ${doc.name} (${doc.type}): ${(doc.summary || doc.description || "No summary").slice(0, 200)}`
        )
        .join("\n");

      const insightPrompt = `
You are a procurement analyst. Based on the matching documents below, briefly explain in 2-3 sentences what these documents tell the user about "${q}".

Matching documents:
${context || "(no documents matched)"}

Return ONLY valid JSON with exactly this structure:
{"insight": "2-3 sentences"}
`;

      const insightRaw = await groqChat(
        [{ role: "user", content: insightPrompt }],
        {
          temperature: 0.3,
          response_format: { type: "json_object" },
          timeout: 30000,
        }
      );

      const parsed = JSON.parse(insightRaw);
      if (parsed.insight) insight = String(parsed.insight).trim();
    } catch (insightError) {
      console.warn("AI insight generation failed:", insightError.message);
    }

    res.status(200).json({
      success: true,
      query: q,
      keywords,
      insight,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocumentSummary,
  generateDocumentSummary,
  searchDocuments,
  aiSearchDocuments,
  deleteDocument,
};
