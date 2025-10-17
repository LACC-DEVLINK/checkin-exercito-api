// qr-codes/controllers/qr-codes.controller.ts
import { Controller, Post, Get, Put, Param, Body, Res, ParseUUIDPipe, Header, Query } from '@nestjs/common';
import { QrCodeService } from '../services/qr-code.service';
import { GenerateBatchQrDto, ValidateQrDto } from '../dto/generate-qr.dto';
import type { Response } from 'express';

@Controller('qr-codes')
export class QrCodesController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post('generate/:militaryId')
  generateQr(@Param('militaryId', ParseUUIDPipe) militaryId: string, @Body('eventId') eventId: string) {
    return this.qrCodeService.generateForMilitary(militaryId, eventId);
  }

  @Post('batch-generate')
  generateBatchQr(@Body() generateBatchDto: GenerateBatchQrDto) {
    return this.qrCodeService.generateBatch(generateBatchDto.militaryIds, generateBatchDto.eventId);
  }

  @Get('download/:militaryId')
  @Header('Content-Type', 'image/png')
  async downloadQr(@Param('militaryId', ParseUUIDPipe) militaryId: string, @Res() res: Response) {
    const imageBuffer = await this.qrCodeService.getQrCodeImageByMilitaryId(militaryId);
    res.set('Content-Disposition', `attachment; filename="qr-code-${militaryId}.png"`);
    res.send(imageBuffer);
  }
  
  @Get('card/:militaryId')
  @Header('Content-Type', 'application/pdf')
  async getCard(@Param('militaryId', ParseUUIDPipe) militaryId: string, @Res() res: Response) {
    const pdfBuffer = await this.qrCodeService.getQrCardAsPdf(militaryId);
    res.set('Content-Disposition', `inline; filename="card-${militaryId}.pdf"`);
    res.send(pdfBuffer);
  }
  
  @Get('download-batch')
  @Header('Content-Type', 'application/zip')
  async downloadBatch(@Query('militaryIds') militaryIds: string, @Res() res: Response) {
      const ids = militaryIds.split(',');
      const zipBuffer = await this.qrCodeService.generateBatchZip(ids);
      res.set('Content-Disposition', 'attachment; filename="qr-cards-batch.zip"');
      res.send(zipBuffer);
  }

  @Post('validate')
  validateQr(@Body() validateQrDto: ValidateQrDto) {
    return this.qrCodeService.validateQrCode(validateQrDto.qrData);
  }

  @Put('regenerate/:militaryId')
  regenerateQr(@Param('militaryId', ParseUUIDPipe) militaryId: string, @Body('eventId') eventId: string) {
    // A lógica de regeneração é a mesma de geração, pois desativa o QR antigo.
    return this.qrCodeService.generateForMilitary(militaryId, eventId);
  }
}