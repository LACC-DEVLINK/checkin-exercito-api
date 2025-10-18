import {
  Controller, Get, Post, Body, Param, Delete, Patch, Query,
  UploadedFile, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MilitaryService } from './services/military.service';

type UploadFile = { originalname: string; buffer: Buffer };

@Controller('military')
export class MilitaryController {
  constructor(private readonly service: MilitaryService) {}

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@Param('id') id: string, @UploadedFile() file: UploadFile) {
    return this.service.uploadPhoto(id, file);
  }
}
