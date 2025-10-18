import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { MilitaryService } from './services/military.service';
import { MilitaryValidationService } from './services/military-validation.service';
import { FileUploadService } from './services/file-upload.service';
import { MilitaryController } from './military.controller';

@Module({
  controllers: [MilitaryController],
  providers: [PrismaService, MilitaryService, MilitaryValidationService, FileUploadService],
})
export class MilitaryModule {}
