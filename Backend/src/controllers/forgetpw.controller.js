import { forgetPasswordService } from "../services/forgetpw.service.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const forgetPasswordController = async (req, res, next) => {
  try {
    const { username, uemail, captchaText, jSessionId } = req.body;

    if (!username || !uemail || !captchaText || !jSessionId) {
      return res.status(400).json({
        success: false,
        message:
          "username, uemail, captchaText, and jSessionId all are Required",
      });
    }

    if (!EMAIL_REGEX.test(uemail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid registered email id",
      });
    }

    const result = await forgetPasswordService(
      username,
      uemail,
      captchaText,
      jSessionId,
    );

    return res.status(result.success ? 200 : 400).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Forget Password Controller Error:", error.message);
    next(error);
  }
};

export { forgetPasswordController };