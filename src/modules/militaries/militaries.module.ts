import { Module } from '@nestjs/common';
import { MilitariesService } from './militaries.service';
import { MilitariesController } from './militaries.controller';
import { QRCodeService } from './qrcode.service';

@Module({
  controllers: [MilitariesController],
  providers: [MilitariesService, QRCodeService],
  exports: [MilitariesService, QRCodeService],
})
export class MilitariesModule {}
