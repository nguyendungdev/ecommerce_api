import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'src/configs/configs.constants';
import { User } from '../../modules/user/user.entity';

export const TypeOrmConfig: TypeOrmModule = {
   type: databaseConfig.type,
   host: databaseConfig.host,
   port: databaseConfig.port,
   username: databaseConfig.username,
   password: databaseConfig.password,
   database: databaseConfig.database,
   autoLoadEntities: true,
   synchronize: databaseConfig.synchronize,
   softDelete: true,
};
