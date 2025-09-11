// Description: Custom hook to debounce a value change in React.
// Il Debounce è una tecnica per limitare la frequenza con cui una funzione viene eseguita.
// In questo caso, viene utilizzata per ritardare l'aggiornamento di un stato fino a quando non è trascorso un certo periodo di tempo dall'ultima modifica.
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
