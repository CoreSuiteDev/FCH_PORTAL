import { google } from "googleapis"
import nodemailer from "nodemailer"

const CLIENT_ID = process.env.SMTP_CLIENT_ID
const CLIENT_SECRET = process.env.SMTP_CLIENT_SECRET
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = process.env.SMTP_REFRESH_TOKEN
const USER_EMAIL = process.env.SMTP_USER_EMAIL

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(to: string, subject: string, text: string) {
  try {
    const accessToken = await oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token || undefined,
      },
    })

    const mailOptions = {
      from: `FCH PORTAL <${USER_EMAIL}>`,
      to,
      subject,
      text: text,
    }

    const result = await transport.sendMail(mailOptions)
    return result
  } catch (err) {
    console.log("ERROR: failed to send mail", err)
    throw err
  }
}

export default sendMail
