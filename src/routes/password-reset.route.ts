import express from 'express';
import ResetPassword from '@/controllers/password-reset/reset-password.controller';
import { TError, TUser} from '@/types/types';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { password, passwordConfirmation, recoveryId, recoveryHash } = req.body;

    const userData: TError | TUser = await ResetPassword({password, passwordConfirmation, recoveryId, recoveryHash});
    if (isErrorUser(userData)) {
      return res.json(userData);
    }

    const userId = userData.id;

    res.json({userId});
  } catch(e) {
    throw new Error('Password reset Error')
  }
});

function isErrorUser(data: TError | TUser): data is TError {
  return !!(data as TError).error;
}

export default router;