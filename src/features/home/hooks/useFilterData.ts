import { useMemo, useDeferredValue } from 'react';

/**
 * Hook optimizado para filtrar datos con debounce
 */
const useFilterData = (data: any[], searchData: string) => {
  // Usar useDeferredValue para diferir actualizaciones costosas
  const deferredSearchData = useDeferredValue(searchData);
  
  return useMemo(() => {
    if (!data || !deferredSearchData) return data;

    // Normalizar búsqueda para mejor rendimiento
    const normalizedSearch = deferredSearchData.toLowerCase().trim();
    if (normalizedSearch === '') return data;

    const startTime = Date.now();
    
    const dataType = Object.prototype.toString.call(data);

    if (dataType === '[object Array]') {
      const filtered = data.filter(obj => {
        // Optimización: buscar solo en campos relevantes para lugares
        if (obj.nombre || obj.descripcion || obj.tipo) {
          const searchableFields = [obj.nombre, obj.descripcion, obj.tipo?.nombre];
          return searchableFields.some(field => 
            field && String(field).toLowerCase().includes(normalizedSearch)
          );
        }
        // Fallback para otros tipos de objetos
        return Object.values(obj).some(value =>
          String(value).toLowerCase().includes(normalizedSearch)
        );
      });

      const elapsed = Date.now() - startTime;
      if (elapsed > 10) {
        console.log(`⚠️ Slow filter operation: ${elapsed}ms for ${data.length} items`);
      }

      return filtered;
    }

    else if (dataType === '[object Object]') {
      return Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          const valueType = Object.prototype.toString.call(value);

          if (valueType === '[object Array]' || valueType === '[object Object]') {
            return false;
          }

          return String(value).toLowerCase().includes(normalizedSearch);
        })
      );
    }

    return data;
  }, [data, deferredSearchData]);
};

export default useFilterData;
