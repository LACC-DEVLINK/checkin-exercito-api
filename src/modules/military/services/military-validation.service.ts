import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { DuplicatedCpfException, InvalidRankException } from '../exceptions/military.exceptions';

@Injectable()
export class MilitaryValidationService {
  constructor(private prisma: PrismaService) {}

  async validateCreate(dto: any) {
    const existing = await this.prisma.military.findUnique({ where: { cpf: dto.cpf } });
    if (existing) throw new DuplicatedCpfException(dto.cpf);

    if (dto.rank && !this.isValidRank(dto.rank)) throw new InvalidRankException();
  }

  async validateUpdate(id: string, dto: any) {
    if (dto.cpf) {
      const existing = await this.prisma.military.findFirst({
        where: { cpf: dto.cpf, NOT: { id } },
      });
      if (existing) throw new DuplicatedCpfException(dto.cpf);
    }
  }

  private isValidRank(rank: string): boolean {
    const valid = ['Soldado', 'Cabo', 'Sargento', 'Tenente', 'Capitão', 'Major', 'Coronel'];
    return valid.includes(rank);
  }
}
