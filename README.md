

---

# **Full Stack Data Visualization Dashboard**

### **Overview**
This project is a comprehensive full-stack application designed for data visualization and advanced data analysis. It features a React-based frontend, a scalable NestJS backend, and integration with google OAuth and NLP services. 

### **Key Features**
- **Interactive Dashboards**: Developed a highly interactive frontend using React, featuring real-time data visualization with Google Charts.
- **Secure Authentication**: Implemented secure user authentication with JSON Web Tokens (JWT) and integrated Google OAuth for an additional layer of security.
- **Scalable Backend**: Built a scalable and maintainable backend with NestJS and TypeORM, using MySQL workbench for efficient data management.
- **AI-Powered Insights**: Integrated Google Cloud Natural Language API to provide data analysis and AI insights.
- **Responsive Design**: Ensured a responsive and modern UI with CSS3, leveraging React Hooks for effective state management.
- **File Management**: Implemented file upload and download functionality using Multer, with secure file storage practices.
- **RESTful API**: Developed a RESTful API for seamless communication between the frontend and backend components.
- **TypeScript Integration**: Utilized the power of Typescript and relevant nestJS modules for readability and maintainability.

### **Tech Stack**
- **Frontend**: React, CSS3, Google Charts, React Hooks
- **Backend**: NestJS, TypeORM, MySQL, RESTful API
- **Authentication**: JWT, Google OAuth
- **AI & Data Analysis**: Google Cloud Natural Language API
- **File Management**: Multer

### **Project Structure**
```
├── client/                  # Frontend (React)
│   ├── public/              
│   └── src/
│       ├── components/      # React components
│       ├── contexts/        # Context API for state management
│       ├── hooks/           # Custom React Hooks
│       ├── pages/           # Application pages
│       ├── App.jsx          # Main App component
│       ├── index.js         # Entry point for React
│       └── ...
├── server/                  # Backend (NestJS)
│   ├── src/
│       ├── auth/            # Authentication module
│       ├── common/          # Common utilities and middleware
│       ├── database/        # TypeORM entities and database connection
│       ├── modules/         # Various NestJS modules
│       ├── main.ts          # Entry point for the backend
│       └── ...
├── .env                     # Environment variables
├── .gitignore               # Ignored files
├── README.md                # Project documentation
└── package.json             # Project dependencies and scripts
```

### **Installation & Setup**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies for both client and server:**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the server directory and add the necessary environment variables:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/yourdatabase
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development servers:**
   - **Frontend:**
     ```bash
     cd client
     npm start
     ```
   - **Backend:**
     ```bash
     cd server
     npm run start:dev
     ```

### **Usage**
- **User Authentication**: Sign up or log in using email/password or Google OAuth.
- **Interactive Dashboards**: Navigate through the dashboard to view real-time data visualizations.
- **AI-Powered Insights**: Upload data files and receive AI insights, made possible thanks to Google Cloud Natural Language API.

### **Contributing**
Please Feel free to fork this repository and submit pull requests.


---

