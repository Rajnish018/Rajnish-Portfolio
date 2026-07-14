import { mailTransporter } from './mail.config';
import { getForgotPasswordTemplate } from './mail.templates';

export const sendForgotPasswordEmail = async (toEmail: string, resetUrl: string) => {
  const htmlContent = getForgotPasswordTemplate({ resetUrl });

  const mailOptions = {
    from: `"Workspace Security" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "🔒 Administrative Account Password Reset Request",
    html: htmlContent,
  };

  return await mailTransporter.sendMail(mailOptions);
};