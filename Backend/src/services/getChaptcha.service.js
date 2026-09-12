import axios from "axios";

const getChaptchaService = async () => {
  try {
    const ipuUrl =
      process.env.IPUCAPTCHASERVELET ||
      "https://examweb.ggsipu.ac.in/web/CaptchaServlet";

    const response = await axios.get(ipuUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const rawCookies = response.headers["set-cookie"];
    let jSessionId = "";
    if (rawCookies && rawCookies.length > 0) {
      jSessionId = rawCookies[0].split(";")[0];
    }

    return {
      imageBuffer: response.data,
      jSessionId,
    };
  } catch (error) {
    throw new Error("Unable to get Captcha from IPU server: " + error.message);
  }
};

export { getChaptchaService };
