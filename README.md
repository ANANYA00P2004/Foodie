
# Smart Canteen Ordering System 🍽️

A modern web application that simplifies the food ordering process in canteens, enabling students to book meals and admins to manage orders efficiently.

## 🛠 Tech Stack

- **Frontend**: React.js  
- **Database & Auth**: Firebase (Firestore, Authentication)  
- **Styling**: CSS

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

![ee9d167c1f254968bd61f03c91971fbf](https://github.com/user-attachments/assets/397aa0f6-296d-4a4c-bd05-d56707dc7562)
![e398b6a7b4ad44c797c9e357cb55a793](https://github.com/user-attachments/assets/d3313b79-e3b0-431b-b2ef-8aaa8bae37b7)
![0fb2e0558ae7454299e9ad8f9f764b7c](https://github.com/user-attachments/assets/942b19c5-499b-4924-a741-6854f87adf87)
![acd637b914f9454abf4e6dd1338894ef](https://github.com/user-attachments/assets/05f6462e-b604-430f-84e6-7c42ddedf465)
![bb4aae33b7de4ed49c00fa99c9e0d8c0](https://github.com/user-attachments/assets/3cdaaf39-fff0-496f-b2b8-cefcdd289607)
![c01f4eb51bb34fdba644187f619d43e5](https://github.com/user-attachments/assets/b514bab3-3d07-4385-993e-dfe79ca47138)
![c01f4eb51bb34fdba644187f619d43e5](https://github.com/user-attachments/assets/2ac88475-d191-4770-8573-9d63fe46c290)


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
- It is a purely client-side React + Firebase app.

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
