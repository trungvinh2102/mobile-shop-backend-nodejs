module.exports = {
  host: process.env.MAIL_HOST || "mail",
  port: process.env.MAIL_PORT || 587,
  user: process.env.MAIL_USER || "user",
  pass: process.env.MAIL_PASS || "name",
};
