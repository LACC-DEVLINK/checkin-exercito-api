import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PhotoUploadException } from '../exceptions/military.exceptions';

type UploadFile = { originalname: string; buffer: Buffer };

@Injectable()
export class FileUploadService {
  private uploadDir = path.resolve(process.cwd(), 'uploads/military');

  async saveFile(file: UploadFile): Promise<string> {
    try {
      if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir, { recursive: true });
      const fileName = `${Date.now()}_${file.originalname}`;
      const filePath = path.join(this.uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/military/${fileName}`;
    } catch (err: any) {
      throw new PhotoUploadException(err?.message || 'Erro ao salvar arquivo');
    }
  }
}
