import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Military } from './entities/military.entity';
import { Rank } from './entities/rank.entity';
import { Unit } from './entities/unit.entity';
import { MilitaryRepository } from './repository/military.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Military,
      Rank, 
      Unit
    ])
  ],
  providers: [
    MilitaryRepository,
  ],  
  exports: [
    TypeOrmModule,      
    MilitaryRepository, 
  ]
})
export class MilitaryModule {}
