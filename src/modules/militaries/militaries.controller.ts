import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MilitariesService } from './militaries.service';
import { 
  CreateMilitaryDto, 
  UpdateMilitaryDto, 
  MilitaryResponseDto,
  GenerateQRCodeDto,
  QRCodeResponseDto,
} from './dto/military.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Militares')
@Controller('militaries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class MilitariesController {
  constructor(private readonly militariesService: MilitariesService) {}

  @Post('generate-qrcode')
  @ApiOperation({ summary: 'Gerar QR Code para um militar' })
  @ApiResponse({ status: 200, description: 'QR Code gerado com sucesso', type: QRCodeResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  generateQRCode(@Body() generateQRCodeDto: GenerateQRCodeDto) {
    return this.militariesService.generateQRCode(generateQRCodeDto.nomeCompleto);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo militar' })
  @ApiResponse({ status: 201, description: 'Militar criado com sucesso', type: MilitaryResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createMilitaryDto: CreateMilitaryDto) {
    return this.militariesService.create(createMilitaryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os militares' })
  @ApiResponse({ status: 200, description: 'Lista de militares', type: [MilitaryResponseDto] })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll() {
    return this.militariesService.findAll();
  }

  @Get('qr/:qrCode')
  @ApiOperation({ summary: 'Buscar militar por QR Code' })
  @ApiResponse({ status: 200, description: 'Militar encontrado', type: MilitaryResponseDto })
  @ApiResponse({ status: 404, description: 'Militar não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findByQRCode(@Param('qrCode') qrCode: string) {
    return this.militariesService.findByQRCode(qrCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar militar por ID' })
  @ApiResponse({ status: 200, description: 'Militar encontrado', type: MilitaryResponseDto })
  @ApiResponse({ status: 404, description: 'Militar não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findOne(@Param('id') id: string) {
    return this.militariesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar militar' })
  @ApiResponse({ status: 200, description: 'Militar atualizado com sucesso', type: MilitaryResponseDto })
  @ApiResponse({ status: 404, description: 'Militar não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  update(@Param('id') id: string, @Body() updateMilitaryDto: UpdateMilitaryDto) {
    return this.militariesService.update(id, updateMilitaryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover militar (soft delete)' })
  @ApiResponse({ status: 204, description: 'Militar removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Militar não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  remove(@Param('id') id: string) {
    return this.militariesService.remove(id);
  }
}
