'use client';

import React from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/store';
import { Star, MapPin, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  distance?: number;
}

export function ProductCard({ product, distance }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const cartItem = items.find(
    (item) => item.productId === product.id && item.storeId === product.storeId
  );
  const inCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (inCart > 0) {
      updateQuantity(product.id, inCart + quantity);
    } else {
      addItem({
        productId: product.id,
        storeId: product.storeId,
        storeName: product.store?.name || 'Unknown Store',
        productName: product.name,
        quantity,
        pricePerUnit: product.basePrice,
        image: product.image,
      });
    }
    setQuantity(1);
  };

  const totalPrice = product.basePrice + product.deliveryFee;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Product Image */}
      <div className="relative bg-gray-200 h-48 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {product.sector}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>

        {/* Store Info */}
        <p className="text-sm text-gray-500 mb-2">{product.store?.name}</p>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Distance */}
        {distance !== undefined && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            {(distance / 1000).toFixed(1)} km away
          </div>
        )}

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₦{totalPrice.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">+₦{product.deliveryFee.toLocaleString()} delivery</span>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-4">
          {product.availability ? (
            <span className="text-sm text-green-600 font-semibold">In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="flex items-center gap-2">
          {inCart > 0 ? (
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => updateQuantity(product.id, inCart - 1)}
                className="p-2 hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-1">{inCart}</span>
              <button
                onClick={() => updateQuantity(product.id, inCart + 1)}
                className="p-2 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[1, 2, 3, 4, 5, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddToCart}
                disabled={!product.availability}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
