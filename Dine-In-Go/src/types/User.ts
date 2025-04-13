export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences?: {
    language: string;
    darkMode: boolean;
    notifications: boolean;
  };
  profile?: {
    phoneNumber?: string;
    address?: string;
    profilePicture?: string;
  };
  favorites?: string[]; // Array of restaurant IDs
  bookings?: {
    id: string;
    restaurantId: string;
    date: Date;
    time: string;
    guests: number;
    status: 'confirmed' | 'pending' | 'cancelled';
  }[];
} 