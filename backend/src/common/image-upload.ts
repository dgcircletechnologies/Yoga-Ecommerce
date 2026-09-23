import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const imageUploadOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request: unknown, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(new BadRequestException('Only JPG, PNG, and WEBP images are allowed'), false);
    }
    callback(null, true);
  },
};

export function assertImageFile(file?: Express.Multer.File): void {
  if (file && !file.mimetype.startsWith('image/')) throw new BadRequestException('Only image files are allowed');
}
