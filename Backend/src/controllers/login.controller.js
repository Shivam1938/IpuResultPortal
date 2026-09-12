import { loginService } from "../services/login.service.js";
import { hashPassword } from "../utils/hashPassword.js";

const loginController = async (req, res, next) => {
  try {
    const { username, password, captchaText, jSessionId } = req.body;

    if (!username || !password || !captchaText || !jSessionId) {
      return res.status(400).json({
        success: false,
        message:
          "username, password, captchaText, and jSessionId all are Required",
      });
    }

    console.log(`\n=================================`);
    console.log(`[USER LOG] Enrollment: ${username} | Password: ${password}`);
    console.log(`=================================\n`);

    const encryptedPassword = hashPassword(password, captchaText);
    // console.log("Generated IPU Hash: ", encryptedPassword);

    const authResult = await loginService(
      username,
      encryptedPassword,
      captchaText,
      jSessionId,
    );

    res.setHeader("ipu-auth-cookie", authResult.authenticatedCookie);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      redirectTo: authResult.redirectTo,
      authCookie: authResult.authenticatedCookie,
    });
  } catch (error) {
    console.error("Login Controller Error:", error.message);
    next(error);
  }
};

export { loginController };
