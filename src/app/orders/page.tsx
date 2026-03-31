'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuthStore } from '@/store';
import { useOrders } from '@/hooks/useApi';
import { Order } from '@/types';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const { user, token } = useAuthStore();
  const { fetchOrders, loading, error } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user && token) {
      loadOrders();
    }
  }, [user, token]);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              Please log in to view your orders
            </p>
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Login Now
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CONFIRMED':
      case 'RIDER_ASSIGNED':
      case 'RIDER_AT_STORE':
      case 'ITEM_PURCHASED':
      case 'RIDER_DELIVERING':
        return 'bg-blue-100 text-blue-700';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4 pb-4 border-b">
                    <p className="font-semibold mb-2">Items:</p>
                    <ul className="space-y-1 text-sm">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-gray-600">
                          {item.product?.name} x{item.quantity} - ₦
                          {(item.pricePerUnit * item.quantity).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-700 mb-1">
                      Delivery Address:
                    </p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  </div>

                  {/* Order Total */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold">
                        ₦{order.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Payment</p>
                      <p className={`font-semibold ${
                        order.paymentStatus === 'COMPLETED'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}>
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Rider Info */}
                  {order.rider && (
                    <div className="bg-blue-50 p-3 rounded mb-4">
                      <p className="text-sm font-semibold text-blue-900">
                        Rider: {order.rider.name}
                      </p>
                      <p className="text-sm text-blue-700">📱 {order.rider.phone}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center font-semibold"
                    >
                      Track Order
                    </Link>
                    {order.status === 'DELIVERED' && (
                      <button className="flex-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-semibold">
                        Rate Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
