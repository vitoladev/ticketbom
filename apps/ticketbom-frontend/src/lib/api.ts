import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getData = async <T>(
  endpoint: string,
  params?: Record<string, string>
) => {
  const response = await axiosInstance.get<T>(endpoint, {
    params,
  });
  return response.data;
};
