// Credit maps for different programs.
// Add new programs here as the portal expands.

const CREDIT_MAP = {
  // =========================================================
  // B.Tech Computer Science Engineering (USICT)
  // Batch: 2023-24
  // =========================================================
  BTECH_CSE: {
    // ---- Semester 1 ----
    ES101: 3,
    BS103: 3,
    BS121: 3,
    BS105: 3,
    ES107: 3,
    BS109: 3,
    BS111: 4,
    HS113: 3,
    HS115: 2,
    HS117: 1,
    ES119: 4,

    BS151: 1,
    ES153: 1,
    BS155: 1,
    ES157: 2,
    ES159: 1,
    BS161: 1,

    // ---- Semester 2 ----
    ES102: 3,
    BS104: 3,
    BS120: 3,
    BS106: 3,
    ES108: 3,
    BS110: 3,
    BS112: 4,
    HS114: 3,
    HS116: 2,
    HS118: 1,
    ES114: 3,

    BS152: 1,
    ES154: 1,
    BS156: 1,
    ES158: 1,
    ES160: 1,
    BS162: 1,
    ES164: 2,

    // ---- Semester 3 ----
    ES201: 4,
    HS203: 2,
    CIC205: 4,
    ECC207: 4,
    CIC209: 4,
    CIC211: 4,

    ES251: 1,
    ECC253: 1,
    CIC255: 1,
    CIC257: 1,

    // ---- Semester 4 ----
    BS202: 4,
    HS204: 2,
    CIC206: 4,
    EEC208: 4,
    CIC210: 4,
    CIC212: 4,

    BS252: 1,
    EEC254: 1,
    CIC256: 1,
    CIC258: 1,

    // ---- Semester 5 ----
    HS301: 2,
    CIC303: 3,
    CIC305: 4,
    CIC307: 4,
    CIC309: 3,
    CIC311: 4,

    CIC351: 1,
    CIC353: 1,
    CIC355: 1,
    CIC357: 1,
    CIC359: 1,
    ES361: 1,

    // ---- Semester 6 ----
    MS302: 3,
    HS304: 1,
    CIE306T: 3,
    CIE338T: 3,
    HS352: 2,
    CIE368T: 3,

    AI302P: 1,
    DA304P: 1,
    AI302T: 3,
    DA304T: 3,

    CIE306P: 1,
    CIE338P: 1,
    CIE368P: 1,

    // ---- Semester 7 ----
    MS401: 2,
    ES451: 3,
    ES453: 1,

    // ---- Semester 8 ----
    ES452: 18,
    ES454: 2,
    ES456: 18,
    ES458: 2,
  },

  // =========================================================
  // BCA
  // Add BCA subject credits here.
  // =========================================================
  BCA: {},

  // =========================================================
  // MCA
  // Add MCA subject credits here.
  // =========================================================
  MCA: {},

  // =========================================================
  // B.Tech Information Technology
  // Add B.Tech IT subject credits here.
  // =========================================================
  BTECH_IT: {},

  // =========================================================
  // B.Tech Electronics & Communication Engineering
  // Add B.Tech ECE subject credits here.
  // =========================================================
  BTECH_ECE: {},
};

// -------------------------------------------------------------
// Get credit for a subject according to the student's program
// -------------------------------------------------------------
const getCreditForSubject = (paperCode, program = "BTECH_CSE") => {
  const code = (paperCode || "").replace(/[-\s]/g, "").toUpperCase();

  const programMap = CREDIT_MAP[program];

  if (!programMap) {
    console.warn(`Unknown program "${program}"`);
    return 0;
  }

  if (programMap[code] !== undefined) {
    return programMap[code];
  }

  console.warn(`No credit mapping found for "${paperCode}" in "${program}"`);

  return 0;
};

export { CREDIT_MAP, getCreditForSubject };
