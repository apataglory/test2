import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Product, SearchFilters, SearchResult, Order } from '@/types';
import { useAuthStore } from '@/store';

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (filters: SearchFilters) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.query) params.append('q', filters.query);
        if (filters.sector) params.append('sector', filters.sector);
        if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
        if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await apiClient.get<SearchResult>(
          `/products/search?${params.toString()}`
        );

        if (!response.success) {
          throw new Error(response.error || 'Failed to search products');
        }

        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error searching products';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { search, loading, error };
}

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<Order[]>('/orders', token || undefined);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch orders');
      }

      return response.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching orders';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createOrder = useCallback(
    async (orderData: {
      items: Array<{ productId: string; storeId: string; quantity: number }>;
      deliveryAddress: string;
      deliveryLat: number;
      deliveryLng: number;
      paymentMethod: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<Order>(
          '/orders',
          orderData,
          token || undefined
        );

        if (!response.success) {
          throw new Error(response.error || 'Failed to create order');
        }

        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error creating order';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { fetchOrders, createOrder, loading, error };
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, logout } = useAuthStore();

  const register = useCallback(
    async (credentials: {
      email: string;
      phone: string;
      name: string;
      password: string;
      passwordConfirm: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<any>('/auth/register', credentials);

        if (!response.success) {
          throw new Error(response.error || 'Registration failed');
        }

        if (response.data?.token && response.data?.user) {
          login(response.data.user, response.data.token);
        }

        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const loginUser = useCallback(
    async (credentials: { email: string; password: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<any>('/auth/login', credentials);

        if (!response.success) {
          throw new Error(response.error || 'Login failed');
        }

        if (response.data?.token && response.data?.user) {
          login(response.data.user, response.data.token);
        }

        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  return {
    register,
    login: loginUser,
    logout,
    loading,
    error,
  };
}
