import { NotFoundException, BadRequestException } from '@nestjs/common';

export class MilitaryNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Militar com ID ${id} não encontrado.`);
  }
}

export class DuplicatedCpfException extends BadRequestException {
  constructor(cpf: string) {
    super(`CPF ${cpf} já está cadastrado.`);
  }
}

export class InvalidRankException extends BadRequestException {
  constructor() {
    super(`Patente incompatível com a unidade.`);
  }
}

export class PhotoUploadException extends BadRequestException {
  constructor(message = 'Erro ao enviar foto.') {
    super(message);
  }
}
