import { useState, useEffect } from 'react';

export function useAutoSaveDraft<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Load draft on initial mount
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error);
    }
  }, [key]);

  // Save draft whenever value changes
  const setDraftValue = (newValue: T | ((val: T) => T)) => {
    setValue((prev) => {
      const resolvedValue = typeof newValue === 'function' ? (newValue as (val: T) => T)(prev) : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(resolvedValue));
        setIsSaved(true);
      } catch (error) {
        console.error('Failed to save draft to localStorage:', error);
      }
      return resolvedValue;
    });
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(key);
      setValue(initialValue);
      setIsSaved(false);
    } catch (error) {
      console.error('Failed to clear draft from localStorage:', error);
    }
  };

  return { value, setDraftValue, clearDraft, isSaved };
}
