import axios from "axios";
import qs from "qs";

const loginService = async (
  username,
  encryptedPassword,
  captchaText,
  jSessionId,
) => {
  try {
    const loginUrl = "https://examweb.ggsipu.ac.in/web/Login";

    const formData = qs.stringify({
      username: username,
      passwd: encryptedPassword,
      captcha: captchaText,
    });

    const response = await axios.post(loginUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: jSessionId,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Origin: "https://examweb.ggsipu.ac.in",
        Referer: "https://examweb.ggsipu.ac.in/web/login.jsp",
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const rawCookies = response.headers["set-cookie"];
    let authenticatedCookie = jSessionId;

    if (rawCookies && rawCookies.length > 0) {
      authenticatedCookie = rawCookies[0].split(";")[0];
    }

    return {
      status: response.status,
      redirectTo: response.headers["location"],
      authenticatedCookie,
    };
  } catch (error) {
    throw new Error("IPU Authentication failed: " + error.message);
  }
};

export { loginService };
