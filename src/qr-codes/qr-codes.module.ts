// qr-codes/qr-codes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCodesController } from './controllers/qr-codes.controller';
import { QrCodeService } from './services/qr-code.service';
import { QrGeneratorService } from './services/qr-generator.service';
import { QrCode } from './entities/qr-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QrCode])],
  controllers: [QrCodesController],
  providers: [QrCodeService, QrGeneratorService],
})
export class QrCodesModule {}