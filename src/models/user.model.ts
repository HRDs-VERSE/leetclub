import mongoose, { Document, Schema, Model } from 'mongoose';

interface TechStack {
  name: string;
}

interface CompetitivePlatform {
  platformName: string;
  username: string

}

export interface User extends Document {
  avatar: string;
  username: string;
  email: string;
  password: string;
  about?: string;
  isVerified: boolean;
  newUserInfoDone: boolean
  techStack: TechStack[];
  competitivePlatforms: CompetitivePlatform[];
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isOAuth?: boolean;
  oAuthUID?: string;
}

const techStackSchema = new Schema<TechStack>({
  name: {
    type: String,
  },
});

const competitivePlatformSchema = new Schema<CompetitivePlatform>({
  platformName: {
    type: String,
  },
  username: {
    type: String,
  },
});

const userSchema = new Schema<User>(
  {
    avatar: {
      type: String,
      default: '',
      required: true 
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (v: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    about: {
      type: String,
      default: '', 
    },
    newUserInfoDone: {
      type: Boolean,
      default: false,
    },
    isOAuth: {
      type: Boolean,
      default: false,
    },
    oAuthUID: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      default: null, 
    },
    verifyCodeExpiry: {
      type: Date,
      default: null,
    },
    techStack: [techStackSchema],
    competitivePlatforms: [competitivePlatformSchema],
  },
  {
    timestamps: true, 
  }
);

const User: Model<User> = mongoose.models.User || mongoose.model<User>('User', userSchema);

export default User;
