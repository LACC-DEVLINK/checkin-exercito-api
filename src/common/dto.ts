// Common DTOs - TODO: DTOs compartilhados

// Este arquivo será usado para DTOs que são compartilhados entre módulos
// Por enquanto está vazio, mas pode ser expandido conforme necessário

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface ResponseDto<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponseDto<T> extends ResponseDto<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
