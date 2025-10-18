import { Repository, DataSource } from 'typeorm';
import { Military } from '../entities/military.entity';
import { MilitaryStatus } from '../enums/military-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MilitaryRepository extends Repository<Military> {
  constructor(private dataSource: DataSource) {
    super(Military, dataSource.createEntityManager());
  }

  async findByIdentityNumber(identityNumber: string): Promise<Military | null> {
    return this.findOne({
      where: { identityNumber },
      relations: ['rank', 'unit']
    });
  }

  async findByCpf(cpf: string): Promise<Military | null> {
    return this.findOne({
      where: { cpf },
      relations: ['rank', 'unit']
    });
  }

  async findByStatus(status: MilitaryStatus): Promise<Military[]> {
    return this.find({
      where: { status },
      relations: ['rank', 'unit'],
      order: { name: 'ASC' }
    });
  }

  async findByRank(rankId: string): Promise<Military[]> {
    return this.find({
      where: { rank: { id: rankId } },
      relations: ['rank', 'unit'],
      order: { admissionDate: 'ASC' }
    });
  }

  async findByUnit(unitId: string): Promise<Military[]> {
    return this.createQueryBuilder('military')
      .leftJoinAndSelect('military.rank', 'rank')
      .leftJoinAndSelect('military.unit', 'unit')
      .where('military.unitId = :unitId', { unitId })
      .orderBy('rank.hierarchyOrder', 'ASC')
      .getMany();
  }

  async findActiveMilitaries(page: number = 1, limit: number = 10): Promise<[Military[], number]> {
    const skip = (page - 1) * limit;
    
    return this.findAndCount({
      where: { 
        isActive: true,
        status: MilitaryStatus.ACTIVE 
      },
      relations: ['rank', 'unit'],
      order: { name: 'ASC' },
      skip: skip,
      take: limit
    });
  }

  async searchByName(name: string): Promise<Military[]> {
    return this.createQueryBuilder('military')
      .leftJoinAndSelect('military.rank', 'rank')
      .leftJoinAndSelect('military.unit', 'unit')
      .where('LOWER(military.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .orderBy('military.name', 'ASC')
      .getMany();
  }

  async cpfExists(cpf: string, excludeId?: string): Promise<boolean> {
    const query = this.createQueryBuilder('military')
      .where('military.cpf = :cpf', { cpf });

    if (excludeId) {
      query.andWhere('military.id != :excludeId', { excludeId });
    }
    const count = await query.getCount();
    return count > 0;
  }

  async identityNumberExists(identityNumber: string, excludeId?: string): Promise<boolean> {
    const query = this.createQueryBuilder('military')
      .where('military.identityNumber = :identityNumber', { identityNumber });

    if (excludeId) {
      query.andWhere('military.id != :excludeId', { excludeId });
    }
    const count = await query.getCount();
    return count > 0;
  }

  async saveMilitary(militaryData: Partial<Military>): Promise<Military> {
    const military = this.create(militaryData);
    return this.save(military);
  }

  async deactivateMilitary(id: string): Promise<void> {
    await this.update(id, {
      isActive: false,
      status: MilitaryStatus.INACTIVE
    });
  }
}
