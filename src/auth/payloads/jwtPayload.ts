import { Role } from '../../modules/user/roles.enum';

export default interface JwtPayload {
   email: string;
   roles: Role[];
}
