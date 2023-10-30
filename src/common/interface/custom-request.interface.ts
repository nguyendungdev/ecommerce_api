import { User } from '../../modules/users/entities/user.entity';

export interface CustomRequest extends Request {
   user?: User;
}
