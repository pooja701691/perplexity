const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const sendVerificationEmail = async (to, token) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_FROM,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      }
    });

    const url = `http://localhost:5000/api/auth/verify/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Verify Email',
      html: `<a href="${url}">Verify Email</a>`
    });

    console.log("✅ Email sent");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

module.exports = { sendVerificationEmail };