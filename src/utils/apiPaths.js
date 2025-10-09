export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
    LOGIN: "/api/auth/login", // Authenticate user and return a JWT token
    GET_PROFILE: "/api/auth/profile", // Retrieve the details of the authenticated user
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Fetch a list of all registered users
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Retrieve details of a specific user by ID
    CREATE_USER: "/api/users", // Create a new user record
    UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details by ID
    DELETE_USER: (userId) => `/api/users/${userId}`, // Permanently remove a user by ID
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Fetch overall task statistics for the admin dashboard
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Fetch personalized task data for the logged-in user
    GET_ALL_TASKS: "/api/tasks", // Retrieve all tasks
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Retrieve task details by ID
    CREATE_TASK: "/api/tasks", // Create a new task
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update an existing task
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a specific task
    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Change the status of a task (e.g., pending, completed)
    UPDATE_TASK_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update a task’s checklist or to-do items
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // Export task data in report format (e.g., CSV, PDF)
    EXPORT_USERS: "/api/reports/export/users", // Export user data in report format
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload and store a user profile image
  },
};
