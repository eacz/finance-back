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
  { name: 'Clothes', description: '' },
  { name: 'Food', description: '' },
  { name: 'Supermarket', description: '' },
  { name: 'Home', description: '' },
  { name: 'Services', description: '' },
];
