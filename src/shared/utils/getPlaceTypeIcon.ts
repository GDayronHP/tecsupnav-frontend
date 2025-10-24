import {
  Classroom,
  Theater,
  Library,
  Restaurant,
  Door,
  PrecissionManufacturing,
  Science,
  Domain,
  Office,
  Apartment,
  SportsSoccer,
  Wc,
} from '@assets/icons/Place-types';

import { createElement} from 'react';
import Svg, { SvgProps } from 'react-native-svg';

type IconProps = React.ComponentProps<typeof Svg>;

const placeIcons: Record<string, React.FC<IconProps>> = {
  classroom: Classroom,
  theater: Theater,
  library: Library,
  restaurant: Restaurant,
  door: Door,
  precission_manufacturing: PrecissionManufacturing,
  science: Science,
  domain: Domain,
  office: Office,
  apartment: Apartment,
  sports_soccer: SportsSoccer,
  wc: Wc,
};

// Mapeo de nombres en español a claves de iconos en inglés
const typeNameMapping: Record<string, string> = {
  'Aula': 'classroom',
  'Laboratorio': 'science',
  'Oficina': 'office',
  'Polideportivo': 'sports_soccer',
  'Baño': 'wc',
  'Teatro': 'theater',
  'Biblioteca': 'library',
  'Restaurante': 'restaurant',
  'Puerta': 'door',
  'Manufactura': 'precission_manufacturing',
  'Dominio': 'domain',
  'Departamento': 'apartment',
};

export default function getPlaceTypeIcon(type?: string, props?: SvgProps) {
  
  const mappedType = type ? typeNameMapping[type] : undefined;

  const IconComponent = (mappedType && placeIcons[mappedType]) || 
                        (type && placeIcons[type]) || 
                        Apartment;
  return createElement(IconComponent, props);
}
