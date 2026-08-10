const Document = require("../models/Document");
const { groqChat } = require("../services/groqClient");

// Get all documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({})
      .sort({ createdAt: -1 });

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
    const { name, type, uploadedBy } = req.body;

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

    const document = await Document.create({
      name,
      type,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      uploadedBy,
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

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

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

Analyze this document record and create a concise business summary.

Document name: ${document.name}
Document type: ${document.type}
File name: ${document.fileName || "Not provided"}

Provide:
1. A short summary
2. Important procurement points
3. Any potential concern or missing information

Keep the response concise and easy to understand.
`;

    const summary = await groqChat(
      [{ role: "user", content: prompt }],
      {
        model: "llama3-70b-8192",
        temperature: 0.4,
      }
    );

    document.summary = summary;
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

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocumentSummary,
  generateDocumentSummary,
  deleteDocument,
};