# Personal Expense Tracker

A modern, mobile-first personal finance application designed to help you effortlessly track expenses, set financial goals, and monitor your spending habits. Built with React and Vite, this application uses Capacitor to provide a seamless, native-feeling Android experience.

## ✨ Features

* **Intuitive Dashboard**: Get a quick overview of your finances with the Home tab, featuring a clean and accessible summary of your recent activities.
* **Comprehensive Tracking**: Log your expenses and income easily with a custom entry sheet. 
* **Financial Goals**: Set, manage, and track progress towards your financial goals in a dedicated section.
* **Detailed Statistics**: Visualize your spending habits over time with interactive charts and data breakdowns in the Stats tab.
* **Transaction History**: View, filter, and manage all your past transactions in the All tab.
* **Offline First & Privacy Focused**: Your data is yours. All financial information is securely stored on your device using persistent local storage (via custom React hooks) – no internet connection required.
* **Cross-Platform Ready**: Developed as a progressive web app with a responsive design, easily compilable into a native Android application using Capacitor.
* **Customizable Settings**: Tailor the app experience to your needs with various configuration options available in the Settings tab.

## 🚀 Technology Stack

* **Frontend Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Mobile Deployment**: [Capacitor](https://capacitorjs.com/) (Android)
* **Styling**: Vanilla CSS with modern custom fonts (Figtree, Sora, Space Grotesk)
* **State Management**: React Hooks & Custom `useLocalStorage` for data persistence

## 🛠️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd "personal expenses tracker by gemini"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Android

This project is configured to be built as a native Android app using Capacitor.

1. Build the web assets:
   ```bash
   npm run build
   ```

2. Sync the assets to the Android project:
   ```bash
   npx cap sync android
   ```

3. Open the project in Android Studio to build and run:
   ```bash
   npx cap open android
   ```

## 📱 Screenshots

*(Add screenshots of your Home, Stats, Goals, and Settings tabs here to showcase the UI)*

---
*Built with ❤️ using React and Vite.*
