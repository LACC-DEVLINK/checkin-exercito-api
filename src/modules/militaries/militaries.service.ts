import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateMilitaryDto, UpdateMilitaryDto } from './dto/military.dto';
import { QRCodeService } from './qrcode.service';

@Injectable()
export class MilitariesService {
  constructor(
    private prisma: PrismaService,
    private qrcodeService: QRCodeService,
  ) {}

  async create(createMilitaryDto: CreateMilitaryDto) {
    // Se não vier qrCode e qrCodeImage, gera automaticamente
    let qrCode = createMilitaryDto.qrCode;
    let qrCodeImage = createMilitaryDto.qrCodeImage;

    if (!qrCode || !qrCodeImage) {
      const tempId = `temp-${Date.now()}`;
      const qrData = await this.qrcodeService.generateQRCode(
        tempId,
        createMilitaryDto.nomeCompleto,
      );
      qrCode = qrData.code;
      qrCodeImage = qrData.image;
    }

    return this.prisma.military.create({
      data: {
        ...createMilitaryDto,
        qrCode,
        qrCodeImage,
      },
    });
  }

  /**
   * Gera um novo QR Code sem salvar no banco
   */
  async generateQRCode(nomeCompleto: string): Promise<{ code: string; image: string }> {
    const tempId = `temp-${Date.now()}`;
    return this.qrcodeService.generateQRCode(tempId, nomeCompleto);
  }

  async findAll() {
    return this.prisma.military.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const military = await this.prisma.military.findUnique({
      where: { id },
    });

    if (!military || military.deletedAt) {
      throw new NotFoundException(`Militar com ID ${id} não encontrado`);
    }

    return military;
  }

  async update(id: string, updateMilitaryDto: UpdateMilitaryDto) {
    await this.findOne(id);

    return this.prisma.military.update({
      where: { id },
      data: updateMilitaryDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.military.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findByQRCode(qrCode: string) {
    const military = await this.prisma.military.findUnique({
      where: { qrCode },
    });

    if (!military || military.deletedAt) {
      throw new NotFoundException(`Militar com QR Code ${qrCode} não encontrado`);
    }

    return military;
  }
}
