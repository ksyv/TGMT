// src/app/models/user.model.ts
export interface User {
  _id: string; // L'ID peut être différent selon votre configuration
  username?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string; // Le mot de passe n'est pas nécessaire côté client
  telephone?: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  gameTables?: string[]; // Peut-être ajusté en fonction de la relation avec GameTable
}
