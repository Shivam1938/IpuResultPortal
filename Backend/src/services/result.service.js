import axios from "axios";

/**
 * Fetches dynamic student result data from the internal IPU JSON API.
 *
 * @param {string} authCookie - Authenticated user cookie
 * @param {string|number} semester - "all" or a single semester number (1-8)
 */
const fetchScrapedResult = async (authCookie, semester) => {
  const fetchSingleSem = async (semNumber) => {
    try {
      const targetUrl = `https://examweb.ggsipu.ac.in/web/StudentSearchProcess?flag=2&euno=${semNumber}`;
      const response = await axios.get(targetUrl, {
        headers: {
          Cookie: authCookie,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (
        response.data &&
        response.data.stresult &&
        response.data.stresult.length > 0
      ) {
        return {
          semester: semNumber,
          stprofile: response.data.stprofile,
          header: response.data.header,
          stresult: response.data.stresult,
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching Sem ${semNumber}:`, error.message);
      return null;
    }
  };

  if (semester === "all") {
    const semPromises = Array.from({ length: 8 }, (_, i) =>
      fetchSingleSem(i + 1),
    );
    const allSemResults = await Promise.all(semPromises);

    return allSemResults.filter((result) => result !== null);
  }

  return await fetchSingleSem(semester);
};

export { fetchScrapedResult };
