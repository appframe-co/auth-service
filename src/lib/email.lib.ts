import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer';
import PassRecovery from '@/models/pass-recovery.model';

export async function sendEmail(user: {userId: string, email: string}, url: string = '', senderName: string = ''): Promise<string> {
  try {
    const {userId, email} = user;
    const createdAt = Date.now();
    const accessHash = bcrypt.hashSync(new Date() + userId, 10);

    const passRecovery = await PassRecovery.findOneAndUpdate({userId}, {userId, accessHash, createdAt}, {new: true, upsert: true});
    if (passRecovery) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      });
      const urlToResetPassword = url+'?recovery_id='+userId+'&recovery_hash='+accessHash;
      const text = `
        Reset the password? If you would like to reset your password, please click the button below. 
        If you did not request a password reset, then simply ignore this email.
      `;
      const html = `
        <html>
          <p>Reset the password? If you would like to reset your password, please click the button below.</p>
          <p>If you did not request a password reset, then simply ignore this email.</p>
          <a href='${urlToResetPassword}'>Change password</a>
        </html>
      `;
      const mailOptions = {
        from: `${senderName} <${process.env.EMAIL_SERVER_USER}>`,
        to: `${email} <${email}>`,
        subject: 'Password reset request',
        text,
        html
      };
      const info = await transporter.sendMail(mailOptions);

      return info.messageId;
    } else {
      throw('System error.');
    }
  } catch(e) {
    throw e;
  }
}