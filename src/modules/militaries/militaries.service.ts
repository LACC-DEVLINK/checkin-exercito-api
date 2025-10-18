import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateMilitaryDto, UpdateMilitaryDto } from './dto/military.dto';

@Injectable()
export class MilitariesService {
  constructor(private prisma: PrismaService) {}

  private generateQRCode(): string {
    return `QR-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
  }

  async create(createMilitaryDto: CreateMilitaryDto) {
    const qrCode = this.generateQRCode();

    return this.prisma.military.create({
      data: {
        ...createMilitaryDto,
        qrCode,
      },
    });
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
