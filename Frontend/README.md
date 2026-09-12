# Ivy — IPU Result Portal (Frontend)

A React + Vite + Tailwind frontend for the IPU result backend (login → captcha →
`get-result`). Dark, lime-accented dashboard with SGPA/CGPA trend, grade
distribution, semester/year/cumulative breakdowns and a full subject-wise
results table.

## 1. Start the backend first

This frontend expects your Backend (the Express app you already built) to be
running, by default at `http://localhost:3000`, with routes mounted at
`/api/v1`:

- `GET  /api/v1/get-captcha`
- `POST /api/v1/login`
- `POST /api/v1/get-result`

From your `Backend` folder:

```bash
npm install
npm run dev
```

Make sure `Backend/.env` allows this frontend's origin, e.g.:

```
FRONTEND_ORIGIN=http://localhost:5173
```

## 2. Configure the frontend's API URL (optional)

By default the frontend talks to `http://localhost:3000/api/v1`. If your
backend runs elsewhere, copy `.env.example` to `.env` and change it:

```bash
cp .env.example .env
# edit VITE_API_BASE_URL in .env
```

## 3. Install & run

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## How it talks to the backend

- **Captcha** — `GET /get-captcha` is fetched as an image blob. The backend
  exposes the IPU session id via the `ipu-session-id` response header
  (see `app.use(cors({ exposedHeaders: ['ipu-session-id'] }))` in
  `src/app.js`); the frontend reads that header and sends it back as
  `jSessionId` on login, exactly as `login.controller.js` expects.
- **Login** — `POST /login` with `{ username, password, captchaText, jSessionId }`.
  The returned `authCookie` is kept in `sessionStorage` and used for every
  result request.
- **Results** — `POST /get-result` with `{ authCookie, semester: "all" }`,
  matching the shape `result.controller.js` returns: `overallCgpa`,
  `overallPercentage`, and a `semesters` array where each item has
  `stprofile`, `header`, `stresult` and a computed `analytics` block
  (`sgpa`, `percentage`, `totalCredits`).

Because the exact shape of `stprofile`/`header`/`stresult` comes straight
from the upstream IPU JSON (the backend just forwards/annotates it), the UI
reads them generically rather than hard-coding field names:

- The profile card renders whatever keys `stprofile` contains.
- Subject tables use the `header` array from the API for column labels, and
  only rely on the two indices the backend itself guarantees
  (`stresult[i][1]` = paper code, `stresult[i][5]` = total marks — see
  `backend/src/utils/calculateGpa.js`) for grade-scale calculations
  (pass rate, top grades, yearwise/cumulative GPA, etc).

If your backend's real payload uses different field names, nothing needs to
be hard-coded here — the UI already adapts to what it receives.

## Build for production

```bash
npm run build
npm run preview
```
