import express from 'express';
import GetUser from '@/controllers/begin-password-reset/get-user.controller';
import {sendEmail} from '@/lib/email.lib';
import { TError, TUser} from '@/types/types';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { email, url, senderName } = req.body;

    const userData: TError | TUser = await GetUser({email});
    if (isErrorUser(userData)) {
      return res.json(userData);
    }

    const userId = userData.id;

    await sendEmail({userId, email}, url, senderName);

    res.json({userId});
  } catch(e) {
    throw new Error('Begin password reset Error');
  }
});

function isErrorUser(data: TError | TUser): data is TError {
  return !!(data as TError).error;
}

export default router;