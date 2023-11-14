import { Role } from '@users/roles.enum';

export default interface JwtPayload {
  email?: string;
  roles?: Role[];
  session_id: string;
}
