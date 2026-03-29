import { useState, type KeyboardEvent } from 'react';
import { useAppStore } from '../store/useAppStore';
import { isValidIngredient } from '@/utils';

export function useIngredientInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const { addIngredient } = useAppStore();

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (!isValidIngredient(trimmed)) {
      setError(
        'Nama bahan hanya boleh mengandung huruf, contoh: ayam, kacang panjang',
      );
      return;
    }

    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    addIngredient(capitalized);
    setValue('');
    setError('');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (error) setError('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd();
  }

  return { value, error, handleAdd, handleChange, handleKeyDown };
}
