// qr-codes/entities/qr-code.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('qr_codes')
export class QrCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  militaryId: string; // UUID do militar

  @Column({ unique: true })
  qrId: string; // Hash único do QR code

  @Column('text')
  qrCodeDataUrl: string; // O QR code em formato base64

  @Column()
  signature: string; // Assinatura para validação de segurança

  @Column({ nullable: true })
  eventId: string; // UUID do evento (opcional, mas recomendado)

  @CreateDateColumn()
  generatedAt: Date;

  @UpdateDateColumn()
  lastValidatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;
}