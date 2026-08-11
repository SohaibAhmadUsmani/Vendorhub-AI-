const express = require("express");

const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocumentSummary,
  generateDocumentSummary,
  searchDocuments,
  aiSearchDocuments,
  deleteDocument,
} = require("../controllers/documentController");

const { authMiddleware } = require("../middleware/authMiddleware");

const upload = require("../middleware/documentUpload");

const router = express.Router();

// All document routes are protected
router.use(authMiddleware);

// Search routes must be defined before /:id
router.get("/search", searchDocuments);
router.get("/ai-search", aiSearchDocuments);

// Get all documents
router.get("/", getDocuments);

// Get single document
router.get("/:id", getDocumentById);

// Upload/create document
router.post(
  "/",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("DOCUMENT UPLOAD ERROR:");
        console.error(JSON.stringify(err, null, 2));
        console.error(err);

        return res.status(500).json({
          success: false,
          message: err.message || "Document upload failed",
          error: err,
        });
      }

      next();
    });
  },
  createDocument
);

// Generate document summary
router.post("/:id/summary", generateDocumentSummary);

// Update AI summary
router.patch("/:id/summary", updateDocumentSummary);

// Delete document
router.delete("/:id", deleteDocument);

module.exports = router;
