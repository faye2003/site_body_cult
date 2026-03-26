export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
}

export interface Price {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string;
  category: string;
}

export interface SalonSettings {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  description: string;
  hours: {
    [key: string]: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: any;
}
