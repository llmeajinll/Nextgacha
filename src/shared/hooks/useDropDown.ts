import { useState, useRef, useEffect } from 'react';

export function useDropDown<T>(initialValue: T) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T>(initialValue);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  const select = (value: T) => {
    setSelected(value);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    isOpen,
    setIsOpen,
    selected,
    setSelected,
    dropdownRef,
    toggle,
    select,
  };
}
