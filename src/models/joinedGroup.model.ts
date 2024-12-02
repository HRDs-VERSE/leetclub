import mongoose, { Document, Schema, Model } from 'mongoose';

export interface JoinedGroup extends Document {
    type: 'collaborate' | 'university' | 'group' | "leetGroup" | "leetUniversity";
    groupId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
}

const joinedGroupSchema = new Schema<JoinedGroup>(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: 'Group', 
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['collaborate', 'university', 'group', "leetGroup", "leetUniversity"],
        },
    },
    {
        timestamps: true,
    }
);

const JoinedGroup: Model<JoinedGroup> = mongoose.models.JoinedGroup || mongoose.model<JoinedGroup>('JoinedGroup', joinedGroupSchema);

export default JoinedGroup;
