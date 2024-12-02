import mongoose, { Document, Schema, Model } from 'mongoose';

export interface Group extends Document {
    name: string
    type: 'collaborate' | 'university' | "leetGroup" | "leetUniversity";
    adminId: mongoose.Types.ObjectId
    membersCount: number
    tagLine?: string;
}

const groupSchema = new Schema<Group>(
    {
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        membersCount: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            required: true,
            enum: ['collaborate', 'university', "leetGroup", "leetUniversity"]
        },
        tagLine: {
            type: String,
            default: '',
        }
    },
    {
        timestamps: true,
    }
);

const Group: Model<Group> = mongoose.models.Group || mongoose.model<Group>('Group', groupSchema);

export default Group;
