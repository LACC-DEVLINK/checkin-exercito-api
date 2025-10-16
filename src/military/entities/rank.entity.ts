import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ranks')
export class Rank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  abbreviation: string;

  @Column({ default: true })
  isActive: boolean;
}
