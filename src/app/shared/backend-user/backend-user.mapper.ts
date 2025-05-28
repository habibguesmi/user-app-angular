import { BackendUser } from './backend-user';
import { User } from 'src/app/models/user.model';

export function mapBackendUserToUser(backendUser: BackendUser): User {
    return {
      id: backendUser.id,
      nom: backendUser.nom ?? backendUser.name ?? '',
      pseudo: backendUser.pseudo ?? backendUser.username ?? '',
      statut: backendUser.statut ?? backendUser.status ?? 'standard',
      budget: backendUser.budget ?? 0
    };
  }