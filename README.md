# [IpuResultPortal](https://ipu-result-portal.vercel.app/)

A full-stack web application built to parse, search, and display examination results for Guru Gobind Singh Indraprastha University (GGSIPU) students.

---

## 🚀 Features

* **Result Search & Visualization:** Quickly search and view student performance and marks details.
* **RESTful API Backend:** Fast Node.js & Express server for handling request routes and serving data.
* **Responsive Frontend:** Clean user interface to display result breakdowns seamlessly.
* **Environment Configuration:** Support for `.env` setup to secure sensitive keys and server configurations.

---

## 🛠 Tech Stack

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **HTTP Client:** Axios
* **Development Tool:** Nodemon

### Frontend
* HTML5 / CSS3 / JavaScript

---

## 📁 Project Structure

```text
IpuResultPortal/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── README.md
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* `npm` package manager

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/IpuResultCheckingSite.git](https://github.com/your-username/IpuResultCheckingSite.git)
cd IpuResultCheckingSite
```

### 2. Setup Backend

Navigate to the `Backend` directory and install dependencies:

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder:

```env
PORT=5000
```

### 3. Start the Application

Run the server with auto-reloading via Nodemon:

```bash
npm start
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.