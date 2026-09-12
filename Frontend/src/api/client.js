import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Pulls a message out of whatever shape the backend/axios error has.
 */
function extractErrorMessage(error, fallback) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
}

/**
 * GET /get-captcha
 * Returns the captcha image as an object URL plus the jSessionId the
 * backend exposes via the `ipu-session-id` response header.
 */
export async function fetchCaptcha() {
  try {
    const response = await client.get("/get-captcha", {
      responseType: "blob",
      // cache-bust so the browser doesn't reuse a stale captcha image
      params: { t: Date.now() },
    });

    const jSessionId =
      response.headers["ipu-session-id"] ||
      response.headers["Ipu-Session-Id"] ||
      "";

    const imageUrl = URL.createObjectURL(response.data);

    return { imageUrl, jSessionId };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Couldn't load the captcha. Is the backend running?"));
  }
}

/**
 * POST /login
 */
export async function login({ username, password, captchaText, jSessionId }) {
  try {
    const response = await client.post("/login", {
      username,
      password,
      captchaText,
      jSessionId,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Login failed. Please check your credentials and captcha."));
  }
}

/**
 * POST /get-result
 * semester: "all" | number
 */
export async function getResult({ authCookie, semester = "all" }) {
  try {
    const response = await client.post("/get-result", {
      authCookie,
      semester,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Couldn't fetch your result. Your session may have expired."));
  }
}

/**
 * POST /forgot-password
 */
export async function forgotPassword({ username, uemail, captchaText, jSessionId }) {
  try {
    const response = await client.post("/forgot-password", {
      username,
      uemail,
      captchaText,
      jSessionId,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Couldn't send the reset link. Please check your details and captcha."),
    );
  }
}

export { API_BASE_URL };