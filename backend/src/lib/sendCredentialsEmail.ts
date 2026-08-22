import nodemailer from 'nodemailer';

export async function sendCredentialsEmail(email: string, name: string, loginId: string, plainPassword: string) {
  // Check if credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS is not set. Skipping email delivery.");
    console.log(`[DUMMY EMAIL LOG] To: ${email} | Login ID: ${loginId} | Password: ${plainPassword}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Dayflow HR" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Dayflow - Your Login Credentials',
    html: `
      <div style="font-family: sans-serif; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #4F46E5;">Welcome to Dayflow, ${name}!</h2>
        <p>Your employee account has been successfully created. You can now access your workspace.</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Login ID:</strong> <span style="font-family: monospace; color: #111827;">${loginId}</span></p>
          <p style="margin: 0;"><strong>Password:</strong> <span style="font-family: monospace; color: #111827;">${plainPassword}</span></p>
        </div>
        
        <p style="font-size: 0.9em; color: #6b7280;">Please log in using these credentials. You will be asked to change your password upon your first login.</p>
        
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #9ca3af; text-align: center;">Dayflow HRMS automatically generated this email. Do not reply.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
