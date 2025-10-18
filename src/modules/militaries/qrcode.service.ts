import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  /**
   * Gera um código único para o QR Code
   */
  generateUniqueCode(militaryId: string, nomeCompleto: string): string {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const namePart = nomeCompleto
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, '');
    
    return `MIL-${namePart}-${timestamp}-${randomPart}`;
  }

  /**
   * Gera a imagem do QR Code em base64
   */
  async generateQRCodeImage(data: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 400,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrCodeDataURL;
    } catch (error: any) {
      throw new Error(`Erro ao gerar QR Code: ${error.message}`);
    }
  }

  /**
   * Gera QR Code completo (código + imagem)
   */
  async generateQRCode(militaryId: string, nomeCompleto: string): Promise<{ code: string; image: string }> {
    const code = this.generateUniqueCode(militaryId, nomeCompleto);
    const image = await this.generateQRCodeImage(code);

    return { code, image };
  }

  /**
   * Valida se um código QR é válido
   */
  validateQRCode(code: string): boolean {
    const qrCodePattern = /^MIL-[A-Z]{3}-\d{13}-[A-Z0-9]{8}$/;
    return qrCodePattern.test(code);
  }
}
