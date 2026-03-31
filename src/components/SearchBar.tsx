'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ProductSector } from '@/types';

interface SearchBarProps {
  onSearch: (query: string, filters: any) => void;
  isLoading?: boolean;
}

const sectors: ProductSector[] = [
  'EATABLES',
  'CLOTHING',
  'ELECTRONICS',
  'HOUSEHOLD',
  'HEALTH_BEAUTY',
  'MARKET_PRODUCE',
  'OTHERS',
];

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<ProductSector | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, {
      sector: selectedSector || undefined,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products, stores, or categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedSector}
                onChange={(e) =>
                  setSelectedSector(
                    (e.target.value as ProductSector) || ''
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">All Categories</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Min */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Price (₦)
              </label>
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Price Max */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price (₦)
              </label>
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
