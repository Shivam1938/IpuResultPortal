import { getChaptchaService } from "../services/getChaptcha.service.js";

const getChaptchaController = async (req, res, next) => {
  try {
    const { imageBuffer, jSessionId } = await getChaptchaService();

    if (jSessionId) {
      res.setHeader("ipu-session-id", jSessionId);

      const [cookieName, cookieValue] = jSessionId.split("=");

      res.cookie(cookieName, cookieValue, {
        httpOnly: true,
        secure: false,
        path: "/",
      });
    }

    res.setHeader("Content-Type", "image/png");

    return res.send(imageBuffer);
  } catch (error) {
    console.error("Error in Captcha Controller:", error.message);
    next(error);
  }
};

export { getChaptchaController };
