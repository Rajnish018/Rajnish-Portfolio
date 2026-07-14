interface ForgotPasswordData {
  resetUrl: string;
}

export const getForgotPasswordTemplate = ({ resetUrl }: ForgotPasswordData): string => {
  return `
    <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0b0b0f; color: #ffffff; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px;">
      <h2 style="color: #a855f7; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">Security Synchronization</h2>
      <p style="font-size: 13px; color: rgba(255,255,255,0.6);">A password recovery payload was requested for your administrative account.</p>
      <p style="font-size: 13px; color: rgba(255,255,255,0.6);">This security token expires in <strong>1 hour</strong>.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetUrl}" style="background-color: #a855f7; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 8px; letter-spacing: 0.1em; text-transform: uppercase; display: inline-block;">
          Reset Password Connection
        </a>
      </div>
      <p style="font-size: 11px; color: rgba(255,255,255,0.3); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
        If you did not execute this request, please audit your security logs immediately.
      </p>
    </div>
  `;
};