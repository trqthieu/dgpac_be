import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getFileUrl(path: string): string {
    return `uploads/${path}`;
  }
}
