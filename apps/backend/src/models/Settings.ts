import mongoose, { Model, Schema } from "mongoose";

export interface ISettings extends Document {
  user: mongoose.Types.ObjectId;
  theme: "light" | "dark" | "system";
  language: "en" | "es" | "fr";
  cardLayout: "grid" | "list";
  cardTemplate: "Professional" | "Minimal" | "Bold" | "Creative" | "Elegant";
  autoShareCardsWithConnections: Boolean;
  requireApprovalBeforeSharing: Boolean;
  showCardAnalytics: Boolean;
}

interface ISettingModel extends Model<ISettings> {}

const SettingsSchema = new Schema<ISettings>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "system",
  },

  cardLayout: {
    type: String,
    enum: ["grid", "list"],
    default: "grid",
  },
  language: {
    type: String,
    enum: ["en", "es", "fr"],
    default: "en",
  },
  cardTemplate: {
    type: String,
    enum: ["Professional", "Minimal", "Bold", "Creative", "Elegant"],
    default: "Professional",
  },
  autoShareCardsWithConnections: {
    type: Boolean,
    default: false,
  },
  requireApprovalBeforeSharing: {
    type: Boolean,
    default: true,
  },
  showCardAnalytics: {
    type: Boolean,
    default: false,
  },
});

export const Settings = mongoose.model<ISettings, ISettingModel>(
  "Settings",
  SettingsSchema
);
