import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const apiClientFactory = () => {
  const instance = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    if (session) {
      console.log({ session });
      request.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }

    return request;
  });

  return instance;
};

export const apiClient = apiClientFactory();

export const getData = async <T>(
  endpoint: string,
  params?: Record<string, string>
) => {
  const response = await apiClient.get<T>(endpoint, {
    params,
  });
  return response.data;
};
