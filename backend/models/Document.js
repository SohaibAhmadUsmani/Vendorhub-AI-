const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "contract",
        "certification",
        "purchase_order",
        "invoice",
        "shipping_document",
      ],
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
    },

    fileType: {
      type: String,
    },

    size: {
      type: Number,
    },

    cloudinaryId: {
      type: String,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    keywords: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      default: "",
    },

    summaryKeyPoints: {
      type: [String],
      default: [],
    },

    summaryConcerns: {
      type: [String],
      default: [],
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);