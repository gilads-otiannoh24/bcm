import mongoose, { type Document, Schema, type Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

export interface ISocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "premium" | "admin";
  status: "active" | "inactive" | "pending";
  avatar: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  phone?: string;
  socialLinks: ISocialLinks;
  organization?: mongoose.Types.ObjectId;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
  isAnonymized: boolean;
  fullName: string;
  deletionReason: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

interface IUserModel extends Model<IUser> {
  // Add any static methods here
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["user", "premium", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    avatar: {
      type: String,
      default: "/placeholder.svg",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
    },
    isAnonymized: {
      type: Boolean,
      default: false,
    },
    deletionReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
UserSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for cards created by this user
UserSchema.virtual("cards", {
  ref: "BusinessCard",
  localField: "_id",
  foreignField: "owner",
  count: true,
});

// Virtual for connections count
UserSchema.virtual("connectionsCount", {
  ref: "Connection",
  localField: "_id",
  foreignField: "user",
  count: true,
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (
  this: IUser,
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (this: IUser): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign(
    { id: this._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, // 1 hour expiration
    secret
  );
};

export const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
