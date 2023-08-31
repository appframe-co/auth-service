import validator from 'email-validator'
import User from '@/models/user.model'
import {TError, TLogin, TUser} from '@/types/types'

export default async function GetUser({email, password}: TLogin): Promise<TError|TUser> {
    try {
        if (!email || !password) {
            return {error: 'invalid_request'};
        }

        email = email.toLowerCase().trim();

        if (email.length > 150) {
            return {error: 'invalid_request', description: 'Too many characters.', property: 'email'};
        }

        if (password && (password.length < 2 ||password.length > 100)) {
            return {error: 'invalid_request', description: 'Number of characters from 2 to 100.', property: 'password'};
        }

        if (!validator.validate(email)) {
            return {error: 'invalid_request', description: 'The email address is invalid.', property: 'email'};
        }

        const user = await User.findOne({email});
        if (!user) {
            return {error: 'invalid_user', description: 'You have entered incorrect login information.'};
        }

        const comparePasswordPromise = new Promise((resolve, reject) => {
            user.comparePassword(password, (passwordErr: Error, isMatch: boolean) => {
                if (!passwordErr) {
                    resolve(isMatch);
                } else {
                    reject(passwordErr);
                }
            });
        });
        const isMatch = await comparePasswordPromise;
        if (!isMatch) {
            return {error: 'invalid_user', description: 'You have entered incorrect login information.'};
        }

        return user;
    } catch (error) {
        throw error;
    }
}