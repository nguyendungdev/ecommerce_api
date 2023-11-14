import { Role } from '../../modules/users/roles.enum';

export default interface JwtPayload {
   email: string;
   roles: Role[];
}
