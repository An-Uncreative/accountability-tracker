import mongoose from "mongoose";

const monitorLinkSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster token lookups
monitorLinkSchema.index({ token: 1 });
monitorLinkSchema.index({ walletId: 1 });

export default mongoose.model("MonitorLink", monitorLinkSchema);
