import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, User, Heart, Smile, Sun, Flame } from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  User: User,
  Heart: Heart,
  Smile: Smile,
  Sun: Sun,
  Flame: Flame,
};

export const CategoryFilter = ({ selectedCategory, onSelectCategory, totalCount }) => {
  const { categories } = useStore();

  return (
    <div className="w-full py-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max pb-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const Icon = iconMap[category.icon] || Sparkles;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-orange-400'}`} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
