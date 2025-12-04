import axios from 'axios';

// הגדרת Base URL כברירת מחדל
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Interceptor לטיפול בשגיאות
axios.interceptors.response.use(
  (response) => {
    // אם התגובה תקינה, מחזירים אותה כרגיל
    return response;
  },
  (error) => {
    // טיפול בשגיאות
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // אפשר להוסיף התרעה למשתמש
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error occurred');
    }
    
    // מחזירים את השגיאה כדי שהקומפוננטה תוכל לטפל בה
    return Promise.reject(error);
  }
);

export default {
  getTasks: async () => {
    const result = await axios.get('/items');
    return result.data;
  },

  addTask: async (name) => {
    console.log('addTask', name);
    const result = await axios.post('/items', { name, isComplete: false });
    return result.data;
  },

  setCompleted: async (id, isComplete) => {
    console.log('setCompleted', { id, isComplete });
    const result = await axios.put(`/items/${id}`, { isComplete });
    return result.data;
  },

  deleteTask: async (id) => {
    console.log('deleteTask', id);
    const result = await axios.delete(`/items/${id}`);
    return result.data;
  }
};