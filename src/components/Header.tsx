'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore, useCartStore } from '@/store';
import { ShoppingCart, Home, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, token, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl text-blue-600">
          Deckdrop
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          {user ? (
            <>
              <span className="text-gray-600">
                Welcome, {user.name}
              </span>
              <Link href="/orders" className="text-gray-700 hover:text-blue-600">
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Cart and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            {user ? (
              <>
                <span className="text-gray-600">
                  Welcome, {user.name}
                </span>
                <Link href="/orders" className="text-gray-700 hover:text-blue-600">
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
