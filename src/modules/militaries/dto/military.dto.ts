import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMilitaryDto {
  @ApiProperty({ description: 'Nome completo do militar', example: 'Coronel João Silva Santos' })
  @IsString()
  @IsNotEmpty()
  nomeCompleto: string;

  @ApiProperty({ description: 'Posto ou graduação', example: 'Coronel' })
  @IsString()
  @IsNotEmpty()
  postoGrad: string;

  @ApiProperty({ description: 'Função do militar', example: 'Comandante de Batalhão' })
  @IsString()
  @IsNotEmpty()
  funcao: string;

  @ApiProperty({ description: 'Número da CNH', example: '12345678901', required: false })
  @IsString()
  @IsOptional()
  cnh?: string;

  @ApiProperty({ description: 'Companhia ou seção', example: '1ª Companhia de Infantaria' })
  @IsString()
  @IsNotEmpty()
  companhiaSecao: string;

  @ApiProperty({ description: 'Veículo do militar', example: 'ABC-1234 - Ford Ranger', required: false })
  @IsString()
  @IsOptional()
  veiculo?: string;

  @ApiProperty({ description: 'Situação do militar', example: 'Ativo', required: false })
  @IsString()
  @IsOptional()
  situacao?: string;

  @ApiProperty({ description: 'URL da foto de perfil', required: false })
  @IsString()
  @IsOptional()
  profileImage?: string;
}

export class UpdateMilitaryDto {
  @ApiProperty({ description: 'Nome completo do militar', required: false })
  @IsString()
  @IsOptional()
  nomeCompleto?: string;

  @ApiProperty({ description: 'Posto ou graduação', required: false })
  @IsString()
  @IsOptional()
  postoGrad?: string;

  @ApiProperty({ description: 'Função do militar', required: false })
  @IsString()
  @IsOptional()
  funcao?: string;

  @ApiProperty({ description: 'Número da CNH', required: false })
  @IsString()
  @IsOptional()
  cnh?: string;

  @ApiProperty({ description: 'Companhia ou seção', required: false })
  @IsString()
  @IsOptional()
  companhiaSecao?: string;

  @ApiProperty({ description: 'Veículo do militar', required: false })
  @IsString()
  @IsOptional()
  veiculo?: string;

  @ApiProperty({ description: 'Situação do militar', required: false })
  @IsString()
  @IsOptional()
  situacao?: string;

  @ApiProperty({ description: 'URL da foto de perfil', required: false })
  @IsString()
  @IsOptional()
  profileImage?: string;
}

export class MilitaryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nomeCompleto: string;

  @ApiProperty()
  postoGrad: string;

  @ApiProperty()
  funcao: string;

  @ApiProperty()
  cnh: string | null;

  @ApiProperty()
  companhiaSecao: string;

  @ApiProperty()
  veiculo: string | null;

  @ApiProperty()
  situacao: string;

  @ApiProperty()
  profileImage: string | null;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
