const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BoostMyCV</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px;
    }
    .header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 3px solid #0A66C2;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #0A66C2;
    }
    .content {
      padding: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #0A66C2;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 30px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    h1 {
      color: #0A66C2;
      font-size: 24px;
    }
    p {
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span style="color: #0A66C2;">Boost</span><span style="color: #333;">MyCV</span>
      </div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>BoostMyCV - AI-Powered Resume Optimization</p>
      <p>&copy; ${new Date().getFullYear()} BoostMyCV. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const welcomeEmail = (name: string, verificationUrl: string) => {
  const content = `
    <h1>Welcome to BoostMyCV!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for signing up! We're excited to help you optimize your resume and land your dream job.</p>
    <p>To get started, please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" class="button">Verify Email Address</a>
    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #0A66C2;">${verificationUrl}</p>
    <p>Once verified, you'll be able to:</p>
    <ul>
      <li>Upload and parse your resume</li>
      <li>Score your CV against job descriptions</li>
      <li>Get AI-powered recommendations</li>
      <li>Export professionally formatted PDFs</li>
    </ul>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>The BoostMyCV Team</p>
  `;
  return baseTemplate(content);
};

export const emailVerificationEmail = (name: string, verificationUrl: string) => {
  const content = `
    <h1>Verify Your Email</h1>
    <p>Hi ${name},</p>
    <p>Please verify your email address to complete your registration and start using BoostMyCV.</p>
    <a href="${verificationUrl}" class="button">Verify Email Address</a>
    <p>If the button doesn't work, copy and paste this link:</p>
    <p style="word-break: break-all; color: #0A66C2;">${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't request this verification, please ignore this email.</p>
    <p>Best regards,<br>The BoostMyCV Team</p>
  `;
  return baseTemplate(content);
};

export const passwordResetEmail = (name: string, resetUrl: string) => {
  const content = `
    <h1>Reset Your Password</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>If the button doesn't work, copy and paste this link:</p>
    <p style="word-break: break-all; color: #0A66C2;">${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
    <p>Best regards,<br>The BoostMyCV Team</p>
  `;
  return baseTemplate(content);
};

export const passwordChangedEmail = (name: string) => {
  const content = `
    <h1>Password Changed Successfully</h1>
    <p>Hi ${name},</p>
    <p>This is to confirm that your password has been successfully changed.</p>
    <p>If you did not make this change, please contact our support team immediately at support@boostmycv.co</p>
    <p>For security reasons, we recommend:</p>
    <ul>
      <li>Using a unique password for your BoostMyCV account</li>
      <li>Enabling two-factor authentication if available</li>
      <li>Never sharing your password with anyone</li>
    </ul>
    <p>Best regards,<br>The BoostMyCV Team</p>
  `;
  return baseTemplate(content);
};

export const accountActivatedEmail = (name: string) => {
  const content = `
    <h1>Account Activated!</h1>
    <p>Hi ${name},</p>
    <p>Great news! Your email has been verified and your account is now active.</p>
    <p>You can now access all features:</p>
    <ul>
      <li>Upload up to 2 CVs (Free plan)</li>
      <li>Score CVs 5 times per month</li>
      <li>Get AI-powered recommendations</li>
      <li>Export to PDF</li>
    </ul>
    <p>Ready to get started?</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
    <p>Want unlimited CVs and scoring? Check out our Professional plan for just $9/month.</p>
    <p>Best regards,<br>The BoostMyCV Team</p>
  `;
  return baseTemplate(content);
};
