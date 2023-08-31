import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '@/models/user.model'
import {TError, TUser} from '@/types/types'

type CustomJwtPayload = JwtPayload & { userId: string };

export default async function UserController({accessToken}: {accessToken?: string}): Promise<TError|TUser> {
    try {
        if (!accessToken) {
            return {error: 'invalid_token', description: 'No token provided.'};
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as CustomJwtPayload;

            const user = await User.findById(decoded.userId);
            if (!user) {
                return {error: 'invalid_user'};
            }

            return user;
        } catch(err) {
            return {error: 'invalid_token'};
        }
    } catch (error) {
        throw error;
    }
}