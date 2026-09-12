import crypto from "crypto";

/**
 * Hashes the user's password according to the IPU Portal standard.
 *
 * @param {string} password - User's plain-text password
 * @param {string} captchaText - Captcha text entered by the user (used as salt)
 * @returns {string} Base64-encoded SHA-256 hash
 */
const hashPassword = (password, captchaText) => {
  const combined = password + captchaText;

  // 1. Create a SHA-256 hash in binary form
  const hashBuffer = crypto.createHash("sha256").update(combined).digest();

  // 2. Convert the binary buffer directly to a Base64 string
  //    (same approach used on the client side)
  const base64Password = hashBuffer.toString("base64");

  return base64Password;
};

export { hashPassword };
