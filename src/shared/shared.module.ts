import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserValidations } from './utilities/user.validations';

@Module({
  imports: [PrismaModule],
  providers: [UserValidations],
  exports: [UserValidations],
})
export class SharedModule {}
