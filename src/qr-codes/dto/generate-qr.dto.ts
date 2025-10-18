// qr-codes/dto/generate-qr.dto.ts
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GenerateBatchQrDto {
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  militaryIds: string[];

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  eventId: string;
}

export class ValidateQrDto {
    @IsString()
    @IsNotEmpty()
    qrData: string; // O conteúdo lido do QR Code
}