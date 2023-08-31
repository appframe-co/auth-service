import validator from 'email-validator'
import User from '@/models/user.model'
import {TError, TUser} from '@/types/types'

export default async function GetUser({email}: {email:string}): Promise<TError|TUser> {
    try {
        if (!email) {
            return {error: 'invalid_request'};
        };

        email = email.toLowerCase().trim();

        if (email.length > 150) {
            return {error: 'invalid_request', description: 'Too many characters.', property: 'email'};
        }

        if (!validator.validate(email)) {
            return {error: 'invalid_request', description: "Email address is invalid.", property: 'email'};
        }

        const user = await User.findOne({email});
        if (!user) {
            return {error: 'invalid_user', description: "User not exist."};
        }

        return user;
    } catch (error) {
        throw error;
    }
}