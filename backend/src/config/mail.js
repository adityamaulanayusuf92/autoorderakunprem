const nodeMailer = process.env.MAIL_SERVICE || 'gmail';
const mailUser = process.env.MAIL_USER || 'your-email@gmail.com';
const mailPass = process.env.MAIL_PASS || 'your-password';

export const emailConfig = {
  service: nodeMailer,
  auth: {
    user: mailUser,
    pass: mailPass
  }
};
