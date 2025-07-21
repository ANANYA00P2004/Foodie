
# Smart Canteen Ordering System 🍽️

A modern web application that simplifies the food ordering process in canteens, enabling students to book meals and admins to manage orders efficiently.

## 🛠 Tech Stack

- **Frontend**: React.js  
- **Database & Auth**: Firebase (Firestore, Authentication)  
- **Styling**: CSS (No Tailwind, No Express/Node)

## 🚀 Features

### 👨‍🎓 Student Module:
- User sign-up and login using Firebase Authentication
- Real-time menu display: Meals, Snacks, Chai
- Place orders from available items
- View order history

### 🧑‍💼 Admin Module:
- Secure admin login
- View all student orders in a table format
- Toggle item availability (disable ordering of out-of-stock items)

### 📊 Order Summary:
- Displays student name, email, time, ordered items, and total amount
- Order notifications, if ready

## 🔥 Firebase Integration

- **Authentication**: Email/Password login for students and admins  
- **Firestore Database**:  
  - `users`: Stores user info  
  - `orders`: Stores each booking with details (userId, email, items, time, amount)  
  - `availability`: Tracks item availability status

## 📸 Screenshots

_Add screenshots of student dashboard, admin panel, and order table here._

## 📦 Installation & Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/smart-canteen-ordering.git
   cd smart-canteen-ordering
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Connect your Firebase project:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Replace config in `firebase.js` with your Firebase credentials

4. Start the development server:
   ```bash
   npm start
   ```

## 📌 Notes

- Admin credentials are currently hardcoded for demo/testing.
- This project **does not use** Express or Node.js — it is a purely client-side React + Firebase app.

## 🤝 Contributing

Feel free to fork the project and raise pull requests to enhance features like:
- Search/filter in order dashboard
- Admin analytics
- Cancel/Edit orders functionality
  
## 🌐 Deployment

You can deploy the app on [Firebase Hosting](https://firebase.google.com/docs/hosting) or [Netlify](https://www.netlify.com/).  
For Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```
