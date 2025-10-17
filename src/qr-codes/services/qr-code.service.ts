// src/qr-codes/services/qr-code.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrCode } from '../entities/qr-code.entity';
import { QrGeneratorService } from './qr-generator.service';
import * as puppeteer from 'puppeteer';
import * as sharp from 'sharp';
import JSZip from 'jszip'; // CORREÇÃO 2
import { getQrCardTemplate } from '../templates/qr-card.template';

// Mock: Em uma aplicação real, você buscaria os dados do militar de outro serviço/banco de dados.
const mockMilitaryDatabase = {
    'uuid-militar-1': { name: 'CAP Joab T. Alencar', rank: 'Capitão', idNumber: '123456789', photoUrl: 'https://via.placeholder.com/150' },
    'uuid-militar-2': { name: 'SGT Maria A. Souza', rank: 'Sargento', idNumber: '987654321', photoUrl: 'https://via.placeholder.com/150' },
};


@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(QrCode)
    private readonly qrCodeRepository: Repository<QrCode>,
    private readonly qrGeneratorService: QrGeneratorService,
  ) {}

  async generateForMilitary(militaryId: string, eventId: string): Promise<QrCode> {
    const { v4: uuidv4 } = await import('uuid');
    const qrId = uuidv4();
    const generatedAt = Date.now();

    const payload = { militaryId, qrId, generatedAt, eventId };
    const signature = this.qrGeneratorService.createSignature(payload);
    const qrData = { ...payload, signature };

    const qrCodeDataUrl = await this.qrGeneratorService.generateQrCodeDataUrl(JSON.stringify(qrData));

    await this.qrCodeRepository.update({ militaryId }, { isActive: false });
    
    const newQrCode = this.qrCodeRepository.create({
      militaryId,
      qrId,
      qrCodeDataUrl,
      signature,
      eventId,
      generatedAt: new Date(generatedAt),
      isActive: true,
    });

    return this.qrCodeRepository.save(newQrCode);
  }

  async generateBatch(militaryIds: string[], eventId: string): Promise<QrCode[]> {
    const promises = militaryIds.map(id => this.generateForMilitary(id, eventId));
    return Promise.all(promises);
  }

  async validateQrCode(qrDataString: string): Promise<{ valid: boolean; message: string; militaryId?: string }> {
    try {
      const data = JSON.parse(qrDataString);
      const { militaryId, qrId, generatedAt, eventId, signature } = data;

      if (!militaryId || !qrId || !generatedAt || !signature) {
        throw new Error();
      }

      const qrRecord = await this.qrCodeRepository.findOne({ where: { qrId, isActive: true } });
      if (!qrRecord) {
        return { valid: false, message: 'QR Code inválido, expirado ou não encontrado.' };
      }

      const isValidSignature = this.qrGeneratorService.validateSignature({ militaryId, qrId, generatedAt, eventId }, signature);
      if (!isValidSignature) {
        return { valid: false, message: 'Assinatura do QR Code inválida.' };
      }

      await this.qrCodeRepository.update(qrRecord.id, { isActive: false, lastValidatedAt: new Date() });

      return { valid: true, message: 'QR Code validado com sucesso!', militaryId };
    } catch (error) {
      return { valid: false, message: 'Formato de QR Code inválido.' };
    }
  }
  
  async getQrCodeImageByMilitaryId(militaryId: string): Promise<Buffer> {
    const qrCode = await this.findActiveQrCode(militaryId);
    const base64Data = qrCode.qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
    return Buffer.from(base64Data, 'base64');
  }
  
  async getQrCardAsPdf(militaryId: string): Promise<Buffer> {
    const qrCode = await this.findActiveQrCode(militaryId);
    const militaryData = mockMilitaryDatabase[militaryId];
    if (!militaryData) {
        throw new NotFoundException('Dados do militar não encontrados.');
    }

    const htmlContent = getQrCardTemplate({ ...militaryData, qrCodeDataUrl: qrCode.qrCodeDataUrl });

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ width: '350px', height: '550px' });
    await browser.close();

    return Buffer.from(pdfBuffer); // CORREÇÃO 3
  }

  async generateBatchPdf(militaryIds: string[]): Promise<Buffer> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    let fullHtml = '<html><head><style>body { margin: 0; } .card-container { display: inline-block; margin: 10px; } </style></head><body>';

    for (const militaryId of militaryIds) {
        const qrCode = await this.findActiveQrCode(militaryId);
        const militaryData = mockMilitaryDatabase[militaryId];
        if (militaryData) {
            const cardHtml = getQrCardTemplate({ ...militaryData, qrCodeDataUrl: qrCode.qrCodeDataUrl });
            fullHtml += `<div class="card-container">${cardHtml.substring(cardHtml.indexOf('<body>') + 6, cardHtml.indexOf('</body>'))}</div>`;
        }
    }
    fullHtml += '</body></html>';

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return Buffer.from(pdfBuffer); // CORREÇÃO 3
  }
  
  async generateBatchZip(militaryIds: string[]): Promise<Buffer> {
    const zip = new JSZip(); // CORREÇÃO 2
    for (const militaryId of militaryIds) {
      try {
        const pdfBuffer = await this.getQrCardAsPdf(militaryId);
        zip.file(`${militaryId}-card.pdf`, pdfBuffer);
      } catch (error) {
        console.warn(`Não foi possível gerar o cartão para o militar ${militaryId}: ${error.message}`);
      }
    }
    return zip.generateAsync({ type: 'nodebuffer' });
  }

  private async findActiveQrCode(militaryId: string): Promise<QrCode> {
    const qrCode = await this.qrCodeRepository.findOne({ where: { militaryId, isActive: true } });
    if (!qrCode) {
      throw new NotFoundException(`Nenhum QR code ativo encontrado para o militar com ID ${militaryId}`);
    }
    return qrCode;
  }
}