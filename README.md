# 🌱 Carbon Tracker – Smart Carbon Footprint Analyzer

## 🚀 Overview

Carbon Tracker is a full-stack web application that helps users monitor, analyze, and reduce their carbon footprint based on daily activities like electricity usage, transportation, and lifestyle habits.

The application integrates **machine learning predictions** with interactive dashboards to provide meaningful insights and suggestions.

---

## ✨ Features

* 🔐 User Authentication (Firebase Auth)
* 📊 Carbon Footprint Calculation
* 🤖 ML-based Carbon Emission Prediction
* 📈 Interactive Charts & Dashboard
* 🚗 Transport & Electricity Tracking
* 🧾 History & Reports
* 🌐 Responsive UI

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js / Python (ML Server)
* **Database:** Firebase Firestore
* **ML Model:** Scikit-learn (`model.pkl`)
* **Tools:** Git, GitHub

---

## ⚙️ How It Works

1. User inputs daily activity data
2. Frontend sends data to backend API
3. ML model processes input and predicts carbon emission
4. Results are displayed using charts and analytics

---

## 📦 Project Structure

* `src/` → Frontend (React components, pages)
* `ml-server/` → ML model and API
* `public/` → Static assets

---

## ▶️ Run Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/shubh-888/carbon-tracker.git
cd carbon-tracker
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```env
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_OPENAI_KEY=your_openai_key
```

### 4️⃣ Run Frontend

```bash
npm start
```

### 5️⃣ Run ML Server

```bash
cd ml-server
python main.py
```

---

## 📊 Carbon Calculation Logic

```js
const electricityEmission = electricity * 0.82;
const carEmission = car * 0.21;
const transportEmission = publicTransport * 0.11;
const flightEmission = flight * 0.15;
```

---

## 🌍 Future Improvements

* 📈 Advanced analytics dashboard
* 🤖 Improved ML model accuracy
* ☁️ Deployment (AWS / Firebase Hosting)
* 🔔 Real-time notifications

---

## 👨‍💻 Author

**Shubham Maddhesiya**

* 💼 LinkedIn:[ https://linkedin.com/in/your-profile](https://www.linkedin.com/in/shubham-maddhesiya-bb0031314/)
* 📧 Email: [your-email@example.com](mailto:shubhammaddhesiya888@gmail.com)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
