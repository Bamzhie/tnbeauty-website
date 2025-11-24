import axios from 'axios';

const API_BASE_URL =
  import.meta.env.PROD
    ? 'https://api.tnlbeauty.com'
    : 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Service {
  name: string;
  prices: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
  };
}

export interface AvailableDate {
  date: string;
  displayDate: string;
  type: 'full-day' | 'timed';
  isFull: boolean;
  slotsRemaining: number;
  canBook: boolean;
  availableSlots: string[];
}

export interface PublicBookingData {
  services: Service[];
  availableDates: AvailableDate[];
  totalAvailableDates: number;
  asOf: string;
}

export interface CreateBookingDto {
  name: string;
  phone?: string;
  email?: string;
  service: string;
  level: string; // level1, level2, level3, level4
  date: string; // dd/mm/yyyy format
  time?: string;
  customDesignImage?: File;
}

export const getPublicBookingData = async (): Promise<PublicBookingData> => {
  const { data } = await api.get('/appointment/public');
  return data.data;
};

export const createBooking = async (bookingData: CreateBookingDto | FormData) => {
  const { data } = await api.post('/appointment/book', bookingData, {
    headers: {
      'Content-Type': bookingData instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return data;
};

