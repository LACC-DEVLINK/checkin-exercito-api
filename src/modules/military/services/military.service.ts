import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { MilitaryValidationService } from './military-validation.service';
import { FileUploadService } from './file-upload.service';
import { MilitaryNotFoundException } from '../exceptions/military.exceptions';

@Injectable()
export class MilitaryService {
  constructor(
    private prisma: PrismaService,
    private validation: MilitaryValidationService,
    private uploadService: FileUploadService,
  ) {}

  async create(dto: any) {
    await this.validation.validateCreate(dto);
    return this.prisma.military.create({ data: dto });
  }

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const where: any = {};
    if (query.name) where.name = { contains: query.name, mode: 'insensitive' };
    return this.prisma.military.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const mil = await this.prisma.military.findUnique({ where: { id } });
    if (!mil) throw new MilitaryNotFoundException(id);
    return mil;
  }

  async update(id: string, dto: any) {
    await this.validation.validateUpdate(id, dto);
    return this.prisma.military.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.military.delete({ where: { id } });
  }

  // Use the same UploadFile shape used in the controller
  async uploadPhoto(id: string, file: { originalname: string; buffer: Buffer }) {
    await this.findOne(id);
    const url = await this.uploadService.saveFile(file);
    return this.prisma.military.update({ where: { id }, data: { photoUrl: url } });
  }
}
