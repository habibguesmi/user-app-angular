// models/user-dto.model.ts (backend DTO)
export interface UserDTO {
    id?: number;           // backend auto-généré
    name: string;
    username: string;
    status: 'premium' | 'standard';
    budget: number;
  }