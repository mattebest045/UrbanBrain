import { Calendar, Music, Utensils, Gamepad2, Briefcase, Heart } from 'lucide-react';

export const categories = [
  { id: 'all', label: 'All Events', icon: Calendar },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'food', label: 'Food & Drink', icon: Utensils },
  { id: 'sport', label: 'Sport', icon: Gamepad2 },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'community', label: 'Community', icon: Heart },
];

export const getCategoryIcon = (category: string) => {
  const categoryItem = categories.find((cat) => cat.label === category);
  return categoryItem ? categoryItem.icon : Calendar;
};
