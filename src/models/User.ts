import { Document, Schema, model } from 'mongoose';

import { hashPassword, comparePassword } from '../utils/hashAndComparePassword';
import updateApiKey from '../utils/updateApiKey';

export interface IToken {
    symbol: string;
}

export interface ISettings {
    methods: number;
    minimumCancellableStreamDuration: number;
    tokens: IToken[];
    isSubscribed: boolean;
}

export interface IProfile {
    name: string;
    logoSrc: string;
}

export interface IUser extends Document {
    email: string;
    password: string;
    isVerified?: boolean;
    verificationToken?: string;
    verificationTokenExpiration?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: number;
    settings?: ISettings;
    profile?: IProfile;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: false,
        },
        verificationTokenExpiration: {
            type: Date,
            required: false,
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        settings: {
            methods: { type: Number, required: false },
            minimumCancellableStreamDuration: { type: Number, required: false },
            tokens: [{ symbol: { type: String, required: true } }],
            isSubscribed: { type: Boolean, required: false }
        },
        profile: {
            name: { type: String, required: false },
            logoSrc: { type: String, required: false }
        },
    },
    { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (next) {
    if (this.isModified()) {
        updateApiKey(this);
    }

    if (!this.isModified('password')) {
        return next();
    }

    this.password = await hashPassword(this.password);
    next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (docToUpdate) {
        updateApiKey(docToUpdate);
    }

    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    const isValid = await comparePassword(enteredPassword, this.password);
    return isValid;
};

export default model<IUser>('User', UserSchema);