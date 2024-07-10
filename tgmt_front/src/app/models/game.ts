export interface Game {
  _id: string;
  name: string;
  type: string;
  category: string;
  ageMin: number;
  difficulty: string;
  author: string;
  playerMin: number;
  playerMax: number;
  description: string;
  image: string;
  partytime: number;
  rules: string;
  resourcesLink: string[];
  createdAt: Date;
  tables: any[]; // Ajustez selon le besoin de votre application
  isFavorite: boolean;
}
