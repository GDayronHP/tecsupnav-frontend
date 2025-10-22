import type { Place } from './place';
import type { Option } from './aiAssistant';

export interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  places?: Place[];
  options?: Option[];
  selectedPlace?: Place;
}