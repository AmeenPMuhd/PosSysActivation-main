import axios from "axios";

const BASE_URL = 'http://localhost:8080/';


const UserApi = axios.create({
    baseURL: BASE_URL
  });

  UserApi.interceptors.request.use(
    (config) => {
      console.log("Inside the interceptors : ",sessionStorage.getItem('token'));
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add a response interceptor
UserApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Inside response interceptor : ")
    // const navigate = useNavigate();
    console.log("Error code : ",error.response.status)
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 403 && !originalRequest._retry) {
      console.log("response interceptor")
      originalRequest._retry = true;
      try {
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post('/api/refresh-token', { refreshToken });
        // const { token } = response.data;
        console.log("Navigate to login page")
        // navigate("/login")
        // Retry the original request with the new token
        // originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
      }
    }

    return Promise.reject(error);
  }
);
  
export default UserApi

// export const axiosPrivate =  axios.create({
//     baseURL: BASE_URL,
//     headers: { 'Content-Type' : 'application/json'},
//     withCredentials: true
//   });