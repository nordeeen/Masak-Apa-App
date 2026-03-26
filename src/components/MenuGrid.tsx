'use client';
import { useAppStore } from '../store/useAppStore';
import MenuCard from './MenuCard';

export default function MenuGrid() {
  const { menuSuggestions, selectedMenu, selectMenu } = useAppStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {menuSuggestions.map((menu) => (
        <MenuCard
          key={menu.id}
          menu={menu}
          selected={selectedMenu?.id === menu.id}
          onSelect={() => selectMenu(menu)}
        />
      ))}
    </div>
  );
}
