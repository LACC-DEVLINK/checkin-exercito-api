import { Module } from '@nestjs/common';
import { MilitariesService } from './militaries.service';
import { MilitariesController } from './militaries.controller';

@Module({
  controllers: [MilitariesController],
  providers: [MilitariesService],
  exports: [MilitariesService],
})
export class MilitariesModule {}
