import { useMemo } from 'react';

/**
 * Hook para filtrar arrays u objetos según searchData.
 * @param {Array|Object} data - Datos a filtrar.
 * @param {string} searchData - Texto de búsqueda.
 * @returns {Array|Object} Datos filtrados.
 */
const useFilterData = (data, searchData) => {
  return useMemo(() => {
    if (!data || !searchData) return data;

    const dataType = Object.prototype.toString.call(data);

    if (dataType === '[object Array]') {
      return data.filter(obj =>
        Object.values(obj).some(value =>
          String(value).toLowerCase().includes(searchData.toLowerCase())
        )
      );
    }

    else if (dataType === '[object Object]') {
      return Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          const valueType = Object.prototype.toString.call(value);

          if (valueType === '[object Array]' || valueType === '[object Object]') {
            return false;
          }

          return String(value).toLowerCase().includes(searchData.toLowerCase());
        })
      );
    }

    return data;
  }, [data, searchData]);
};

export default useFilterData;
