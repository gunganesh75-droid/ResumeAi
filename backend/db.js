import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Override DNS servers to use Google Public DNS (8.8.8.8 and 8.8.4.4)
// This resolves issues where local routers/ISPs do not support SRV record queries (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('⚠️ Failed to set custom DNS servers, relying on system defaults:', err.message);
}

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_ai';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('🚀 Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// =========================================================
// MONGOOSE SCHEMAS & MODELS
// =========================================================

// 1. User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  avatar: { type: String, required: true },
  plan: { type: String, default: 'Lifetime Free Plan' }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

const User = mongoose.model('User', userSchema);

// 2. Resume Schema
const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  templateId: { type: String, required: true },
  resumeData: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);

// 3. Analytics Schema
const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  resumesCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },
  downloadsCount: { type: Number, default: 0 }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// 4. OTP Code Schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, default: null },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

const OTPCode = mongoose.model('OTPCode', otpSchema);

// =========================================================
// DATABASE HELPER METHODS
// =========================================================

// Users Helper Methods
export const dbFindUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan,
      createdAt: user.createdAt
    };
  } catch (err) {
    console.error('MongoDB findUserByEmail error:', err);
    throw err;
  }
};

export const dbCreateUser = async (user) => {
  const { name, email, avatar } = user;
  try {
    const newUser = await User.create({
      name,
      email,
      avatar,
      plan: 'Lifetime Free Plan'
    });

    // Initialize analytics row for this user
    await Analytics.create({ userId: newUser._id });

    return {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      plan: newUser.plan
    };
  } catch (err) {
    console.error('MongoDB createUser error:', err);
    throw err;
  }
};

export const dbUpdateUser = async (userId, { name, avatar }) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan
    };
  } catch (err) {
    console.error('MongoDB updateUser error:', err);
    throw err;
  }
};

export const dbDeleteUser = async (userId) => {
  try {
    const result = await User.findByIdAndDelete(userId);
    if (result) {
      // Cascade delete related records
      await Resume.deleteMany({ userId });
      await Analytics.deleteMany({ userId });
      return true;
    }
    return false;
  } catch (err) {
    console.error('MongoDB deleteUser error:', err);
    throw err;
  }
};

// Resumes Helper Methods
export const dbGetUserResumes = async (userId) => {
  try {
    const resumes = await Resume.find({ userId });
    return resumes.map(r => ({
      id: r._id.toString(),
      userId: r.userId.toString(),
      name: r.name,
      templateId: r.templateId,
      resumeData: typeof r.resumeData === 'string' ? JSON.parse(r.resumeData) : r.resumeData,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));
  } catch (err) {
    console.error('MongoDB getUserResumes error:', err);
    throw err;
  }
};

export const dbGetResumeById = async (id) => {
  try {
    const r = await Resume.findById(id);
    if (!r) return null;
    return {
      id: r._id.toString(),
      userId: r.userId.toString(),
      name: r.name,
      templateId: r.templateId,
      resumeData: typeof r.resumeData === 'string' ? JSON.parse(r.resumeData) : r.resumeData,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    };
  } catch (err) {
    console.error('MongoDB getResumeById error:', err);
    throw err;
  }
};

export const dbCreateResume = async (userId, resume) => {
  const name = resume.name || 'Untitled Resume';
  const templateId = resume.templateId || '1';
  const resumeData = resume.resumeData || {};

  try {
    const newResume = await Resume.create({
      userId,
      name,
      templateId: String(templateId),
      resumeData
    });
    
    // Increment resumes count in analytics
    await Analytics.findOneAndUpdate(
      { userId },
      { $inc: { resumesCount: 1 } },
      { upsert: true }
    );

    return {
      id: newResume._id.toString(),
      userId: userId.toString(),
      name,
      templateId: String(templateId),
      resumeData,
      createdAt: newResume.createdAt,
      updatedAt: newResume.updatedAt
    };
  } catch (err) {
    console.error('MongoDB createResume error:', err);
    throw err;
  }
};

export const dbUpdateResume = async (id, resumeData, name, templateId) => {
  try {
    const resume = await Resume.findById(id);
    if (!resume) return null;

    if (name !== undefined) resume.name = name;
    if (templateId !== undefined) resume.templateId = String(templateId);
    if (resumeData !== undefined) {
      resume.resumeData = resumeData;
      resume.markModified('resumeData');
    }

    await resume.save();

    return {
      id: resume._id.toString(),
      userId: resume.userId.toString(),
      name: resume.name,
      templateId: resume.templateId,
      resumeData: resume.resumeData,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt
    };
  } catch (err) {
    console.error('MongoDB updateResume error:', err);
    throw err;
  }
};

export const dbDeleteResume = async (userId, id) => {
  try {
    const result = await Resume.findOneAndDelete({ _id: id, userId });
    if (result) {
      // Decrement resumes count in analytics
      await Analytics.findOneAndUpdate(
        { userId },
        { $inc: { resumesCount: -1 } }
      );
      // Make sure it doesn't drop below 0
      const analytics = await Analytics.findOne({ userId });
      if (analytics && analytics.resumesCount < 0) {
        analytics.resumesCount = 0;
        await analytics.save();
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('MongoDB deleteResume error:', err);
    throw err;
  }
};

// Analytics Helper Methods
export const dbGetUserAnalytics = async (userId) => {
  try {
    let stats = await Analytics.findOne({ userId });
    if (!stats) {
      stats = await Analytics.create({ userId });
    }
    return {
      userId: stats.userId.toString(),
      resumesCreated: stats.resumesCount,
      downloads: stats.downloadsCount,
      views: stats.viewsCount
    };
  } catch (err) {
    console.error('MongoDB getUserAnalytics error:', err);
    throw err;
  }
};

export const dbIncrementDownloads = async (userId) => {
  try {
    await Analytics.findOneAndUpdate(
      { userId },
      { $inc: { downloadsCount: 1 } },
      { upsert: true }
    );
    return await dbGetUserAnalytics(userId);
  } catch (err) {
    console.error('MongoDB incrementDownloads error:', err);
    throw err;
  }
};

export const dbIncrementViews = async (userId) => {
  try {
    await Analytics.findOneAndUpdate(
      { userId },
      { $inc: { viewsCount: 1 } },
      { upsert: true }
    );
    return await dbGetUserAnalytics(userId);
  } catch (err) {
    console.error('MongoDB incrementViews error:', err);
    throw err;
  }
};

// OTP Code Management Methods (SMTP)
export const dbSaveOTP = async (email, name, otp) => {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes expiry
    await OTPCode.findOneAndUpdate(
      { email },
      { name, otp, expiresAt },
      { upsert: true, returnDocument: 'after' }
    );
  } catch (err) {
    console.error('MongoDB saveOTP error:', err);
    throw err;
  }
};

export const dbVerifyOTP = async (email, otp) => {
  try {
    const record = await OTPCode.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() }
    });
    if (!record) return null;
    return {
      email: record.email,
      name: record.name,
      otp: record.otp,
      expiresAt: record.expiresAt
    };
  } catch (err) {
    console.error('MongoDB verifyOTP error:', err);
    throw err;
  }
};

export const dbDeleteOTP = async (email) => {
  try {
    await OTPCode.deleteOne({ email });
  } catch (err) {
    console.error('MongoDB deleteOTP error:', err);
    throw err;
  }
};
