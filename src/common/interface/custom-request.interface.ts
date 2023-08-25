import { User } from '../../modules/user/user.entity';

export interface CustomRequest extends Request {
   user?: User;
}
