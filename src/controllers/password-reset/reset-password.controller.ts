import bcrypt from 'bcryptjs'
import User from '@/models/user.model'
import PassRecovery from '@/models/pass-recovery.model'
import {TError, TUser, TPassRecovery, TPasswordReset} from '@/types/types'

export default async function GetUser(
    {password, passwordConfirmation, recoveryId, recoveryHash}: TPasswordReset
    ): Promise<TError|TUser> {
    try {
        if (password.length < 2 || password.length > 100) {
            return {error: 'invalid_request', description: 'Number of characters from 2 to 100.', property: 'password'};
        }

        if (passwordConfirmation.length < 2 || passwordConfirmation.length > 100) {
            return {error: 'invalid_request', description: 'Number of characters from 2 to 100.', property: 'passwordConfirmation'};
        }

        if (password !== '' && passwordConfirmation !== '' && password !== passwordConfirmation) {
            return {error: 'invalid_request', description: 'Passwords mismatch'};
        }

        const passRecovery: TPassRecovery|null = await PassRecovery.findOne({userId: recoveryId, accessHash: recoveryHash});
        if (!passRecovery) {
            return {error: 'invalid_request', description: 'Password recovery expired'};
        }

        const user = await User.findById(passRecovery.userId);
        if (!user) {
            return {error: 'invalid_user', description: 'User not exist.'};
        }

        const saltRounds = 10;
        const hash = bcrypt.hashSync(passwordConfirmation, saltRounds);
        const updatedUser = await User.findByIdAndUpdate(recoveryId, {password: hash}, {new: true});
        if (!updatedUser) {
            return {error: 'invalid_user', description: 'Try resetting your password later.'};
        }

        if (passRecovery) {
            PassRecovery.findByIdAndRemove(passRecovery.id).exec();
        }

        return user;
    } catch (error) {
        throw error;
    }
}