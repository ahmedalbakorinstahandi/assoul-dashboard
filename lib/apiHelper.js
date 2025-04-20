import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: 'application/json',
    },
});
// localStorage.setItem("clientID", 5)
// Attach token to every request
const token = await getCookie("token");
API.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token'); // Retrieve token
        // console.log(token);

        // const token = "23|aDjo0OIMxXCirC4qanC1lTE0SgpUw2uxxjWpRiJg9d48b4dc"; // Retrieve token

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;

        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Global error handler
const handleApiError = (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
        if (token) {
            console.log("Unauthorized access, logging out...");
            handleLogout();
        }
        window.location.href = "/login";
    }
    throw error.response?.data || error.message;
};

export const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("email");
    deleteCookie("name");
    deleteCookie("id");

    if (typeof window !== 'undefined') {
        localStorage.clear();
        const { push } = require("next/navigation");
        push("/login");
    }
};
// GET Request
export const getData = async (endpoint, params = {}) => {
    try {
        const response = await API.get(endpoint, { params });
        // console.log(response);


        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
// POST Request
export const postData = async (endpoint, body = {}, header = {}, file = null) => {
    try {
        let formData = new FormData();

        // إضافة البيانات الأخرى (مثل الاسم والوصف)
        Object.keys(body).forEach((key) => {
            formData.append(key, body[key]);
        });

        // إضافة الصورة إذا كانت موجودة
        if (file) {
            formData.append("image", file);
        }

        // تعيين الرأس المناسب لرفع الملفات
        const config = {
            headers: {
                "Content-Type": "multipart/form-data", // تحديد أن البيانات من نوع "multipart/form-data"
                ...header,
            },
        };

        const response = await API.post(endpoint, formData, config);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// PUT Request
export const putData = async (endpoint, body = {}, isChild) => {
    try {
        let response
        if (isChild) {

            response = await API.post(endpoint, body);
        } else {
            response = await API.put(endpoint, body);

        }

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// PATCH Request
export const patchData = async (endpoint, body = {}) => {
    try {
        const response = await API.patch(endpoint, body);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// DELETE Request
export const deleteData = async (endpoint, entityId) => {
    try {
        const response = await API.delete(endpoint + `/${entityId}`);
        return response;
    } catch (error) {
        handleApiError(error);
    }
};
