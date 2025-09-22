 const { z } = require("zod");
const moment = require("moment-timezone");

const EducationSchema = z.object({
  id: z.number().optional(),
  school: z.string().optional(),
  degree: z.string().optional(),
  year: z.string().optional(),
  gpa: z.string().optional(),
});

const ExperienceSchema = z.object({
  id: z.number().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

const SkillSchema = z.object({
  name: z.string().optional(),
  level: z.number().optional(),
  category: z.string().optional(),
});

const SocialSchema = z.object({
  website: z.string().url().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
}).optional();

const PreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyReports: z.boolean().optional(),
  jobAlerts: z.boolean().optional(),
  skillRecommendations: z.boolean().optional(),
}).optional();

const ResumeSuggestionSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(["low","medium","high"]).optional(),
});

const ResumeAnalysisSchema = z.object({
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
}).optional();

const ResumeSchema = z.object({
  score: z.number().optional(),
  lastUpdated: z.string().optional(),
  fileName: z.string().optional(),
  suggestions: z.array(ResumeSuggestionSchema).optional(),
  analysis: ResumeAnalysisSchema,
}).optional();

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),

  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().default(() => moment().tz('Asia/Kolkata').toISOString()),

  location: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  education: z.array(EducationSchema).optional(),
  experience: z.array(ExperienceSchema).optional(),
  skills: z.array(SkillSchema).optional(),
  social: SocialSchema,
  preferences: PreferencesSchema,

  resume: ResumeSchema,
});

module.exports = { UserSchema };