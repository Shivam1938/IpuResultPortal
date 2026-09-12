import axios from "axios";
import qs from "qs";

/**
 * Submits the "Forgot Password" form to the IPU Exam Portal.
 * This mirrors what the real forgetpw.jsp page does: it POSTs
 * username, registered email and captcha to /web/Forgetpw using
 * the same jSessionId that the captcha image was issued with.
 *
 * @param {string} username - Enrollment / user name
 * @param {string} uemail - Registered email id
 * @param {string} captchaText - Captcha text entered by the user
 * @param {string} jSessionId - "JSESSIONID=..." cookie string from get-captcha
 */
const forgetPasswordService = async (
  username,
  uemail,
  captchaText,
  jSessionId,
) => {
  try {
    const forgetPwUrl =
      process.env.IPUFORGETPWURL || "https://examweb.ggsipu.ac.in/web/Forgetpw";

    const formData = qs.stringify({
      username: username,
      uemail: uemail,
      captcha: captchaText,
    });

    const response = await axios.post(forgetPwUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: jSessionId,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Origin: "https://examweb.ggsipu.ac.in",
        Referer: "https://examweb.ggsipu.ac.in/web/forgetpw.jsp",
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const rawHtml = typeof response.data === "string" ? response.data : "";

    // The IPU portal replies with a plain HTML page containing a single
    // <h2> message - either a success line or a captcha/validation error.
    const isSuccess = /email sent successfully/i.test(rawHtml);

    const messageMatch = rawHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const portalMessage = messageMatch
      ? messageMatch[1].replace(/<[^>]+>/g, "").trim()
      : rawHtml.trim();

    return {
      status: response.status,
      success: isSuccess,
      message: portalMessage || "No response message received from IPU server.",
    };
  } catch (error) {
    throw new Error(
      "Unable to submit Forgot Password request to IPU server: " +
        error.message,
    );
  }
};

export { forgetPasswordService };