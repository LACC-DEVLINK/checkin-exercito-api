import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  location: string;

  @Column({ default: true })
  isActive: boolean;
}
