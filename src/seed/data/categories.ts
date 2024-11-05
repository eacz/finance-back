import { User } from 'src/auth/entities/user.entity';
import { UserAuth } from 'src/auth/interfaces/authResponse';

export const getCategories = (user: User[]) => {
  const totalCategories = categories.map((category) => {
    const userCategories = user.map((u) => ({ ...category, user: u }));
    return userCategories
  });
  return totalCategories.flat()
};

export const categories = [
  { name: 'Clothes', description: '', icon: 'shirt' },
  { name: 'Food', description: '', icon: 'food' },
  { name: 'Supermarket', description: '', icon: 'store' },
  { name: 'Home', description: '', icon: 'home' },
  { name: 'Services', description: '', icon: 'hammer' },
];
