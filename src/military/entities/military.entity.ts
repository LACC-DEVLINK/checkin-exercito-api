import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Rank } from './rank.entity';
import { Unit } from './unit.entity';
import { MilitaryStatus } from '../enums/military-status.enum';

@Entity('militaries')
export class Military {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  identityNumber: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  qrCode: string;

  @ManyToOne(() => Rank)
  rank: Rank;

  @ManyToOne(() => Unit)
  unit: Unit;

  @Column({
    type: 'enum',
    enum: MilitaryStatus,
    default: MilitaryStatus.ACTIVE
  })
  status: MilitaryStatus;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'date' })
  admissionDate: Date;

  @Column({ default: true })
  isActive: boolean;
}
