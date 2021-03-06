export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: Number(process.env.MAIL_SECURE) === 1 ? true : false,
  ssl: Number(process.env.MAIL_SECURE) === 1 ? true : false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: process.env.MAIL_FROM_DEFAULT,
  },
};
