import mongoose, { Schema, Document } from "mongoose";
import {TPassRecoveryModel} from '@/types/types'

const ObjectId = Schema.ObjectId;

const PassRecoverySchema: Schema = new Schema({
  userId:  {
    type: ObjectId,
    unique: true
  },
  accessHash: String,
  createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600
  }
});

PassRecoverySchema.set('toObject', { virtuals: true });
PassRecoverySchema.set('toJSON', { virtuals: true });

export default mongoose.models.PassRecovery || mongoose.model < TPassRecoveryModel & Document > ("PassRecovery", PassRecoverySchema);