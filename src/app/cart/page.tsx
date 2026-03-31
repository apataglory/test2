'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCartStore, useAuthStore, useLocationStore } from '@/store';
import { useOrders } from '@/hooks/useApi';
import { Trash2, Minus, Plus, MapPin } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, clear } = useCartStore();
  const { user, token } = useAuthStore();
  const { latitude, longitude, address } = useLocationStore();
  const { createOrder, loading: orderLoading } = useOrders();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLat, setDeliveryLat] = useState(latitude || 0);
  const [deliveryLng, setDeliveryLng] = useState(longitude || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (latitude && longitude) {
      setDeliveryLat(latitude);
      setDeliveryLng(longitude);
    }
    if (address) {
      setDeliveryAddress(address);
    }
  }, [latitude, longitude, address]);

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              Please log in to view your cart
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

  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 500 : 0; // Base delivery fee
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    setError('');

    if (!deliveryAddress) {
      setError('Please enter delivery address');
      return;
    }

    if (deliveryLat === 0 || deliveryLng === 0) {
      setError('Please set delivery location');
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      storeId: item.storeId,
      quantity: item.quantity,
    }));

    try {
      setLoading(true);
      const order = await createOrder({
        items: orderItems,
        deliveryAddress,
        deliveryLat,
        deliveryLng,
        paymentMethod: 'FLUTTERWAVE',
      });

      if (order) {
        // Clear cart after successful order
        clear();
        // Redirect to payment
        router.push(`/checkout/${order.id}`);
      }
    } catch (err) {
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.storeId}`}
                  className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <p className="text-sm text-gray-500">{item.storeName}</p>
                    <p className="mt-2 font-semibold">
                      ₦{item.pricePerUnit.toLocaleString()}{' '}
                      <span className="font-normal text-gray-500">x {item.quantity}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ₦{(item.pricePerUnit * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700 mt-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">
                    ₦{deliveryFee.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  rows={3}
                />
              </div>

              {address && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900">Saved Location</p>
                    <p className="text-blue-700">{address}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || orderLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold mb-3"
              >
                {loading || orderLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
