// qr-codes/services/qr-generator.service.ts
import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

interface QrCodePayload {
  militaryId: string;
  qrId: string;
  generatedAt: number;
  eventId: string;
}

@Injectable()
export class QrGeneratorService {
  private readonly secretKey = process.env.QR_SECRET_KEY || 'default-secret-key-change-me';

  /**
   * Gera um QR code em formato Data URL (base64).
   * @param payload - Os dados a serem embutidos no QR code.
   * @returns A string Data URL do QR code.
   */
  async generateQrCodeDataUrl(payload: string): Promise<string> {
    return QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
    });
}
  /**
   * Cria a assinatura digital para o payload do QR code.
   * @param payload - O objeto de dados do QR code.
   * @returns A assinatura em hash.
   */
  createSignature(payload: QrCodePayload): string {
    const dataString = `${payload.militaryId}|${payload.qrId}|${payload.generatedAt}|${payload.eventId}`;
    return crypto.createHmac('sha256', this.secretKey).update(dataString).digest('hex');
  }

  /**
   * Verifica se a assinatura de um QR code é válida.
   * @param payload - O payload extraído do QR code.
   * @param signature - A assinatura a ser validada.
   * @returns `true` se a assinatura for válida, `false` caso contrário.
   */
  validateSignature(payload: QrCodePayload, signature: string): boolean {
    const expectedSignature = this.createSignature(payload);
    return expectedSignature === signature;
  }
}