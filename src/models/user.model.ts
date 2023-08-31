import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs'
import { TUserModel } from "@/types/types";

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        maxlength: 60,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date
    }
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema.pre("save", function (next) {
    const user = this
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError: Error, salt: number | string): void {
        if (saltError) {
          return next(saltError);
        } else {
          bcrypt.hash(user.password, salt, function(hashError: Error, hash: string): void {
            if (hashError) {
              return next(hashError);
            }
  
            user.password = hash;
            next();
          })
        }
      })
    } else {
      return next()
    }
})
  
UserSchema.methods.comparePassword = function(password: string, callback: any) {
    bcrypt.compare(password, this.password, function(error: Error, isMatch) {
        if (error) {
            return callback(error);
        } else {
            callback(null, isMatch);
        }
    })
}

export default mongoose.models.User || mongoose.model < TUserModel > ("User", UserSchema);