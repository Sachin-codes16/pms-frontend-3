import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { API_BASE_URL, setAuthToken } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { saveSession, isAuthenticated } = useAuthContext();
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotificationContext();

  const loginFormSchema = yup.object({
    username: yup.string().required('Please enter your username'),
    password: yup.string().required('Please enter your password'),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink);
    else navigate('/dashboards');
  };

  useEffect(() => {
    if (isAuthenticated) {
      redirectUser();
    }
  }, [isAuthenticated]);

  const login = handleSubmit(async (values) => {
    setLoading(true);
    setError('');
    try {
      const res = await httpClient.post(`${API_BASE_URL}/auth/login-with-username/`, {
        username: values.username,
        password: values.password,
      });
      const userData = res.data;

      // Update the live AUTH_TOKEN so all existing API calls use the new token
      const token =
        userData.token ||
        userData.access_token ||
        userData.accessToken ||
        userData.access ||
        userData.data?.token;
      setAuthToken(token);

      // Save full user data to cookie session
      saveSession(userData);

      redirectUser();
      showNotification({
        message: 'Successfully logged in. Redirecting....',
        variant: 'success',
      });
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        (typeof e?.response?.data === 'string' ? e.response.data : null) ||
        e?.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  });

  return {
    loading,
    login,
    control,
    error,
  };
};

export default useSignIn;
