import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly folder: string;

  constructor(config: ConfigService) {
    this.folder = config.getOrThrow<string>('cloudinary.folder').replace(/\/+$/, '');
    cloudinary.config({
      cloud_name: config.getOrThrow<string>('cloudinary.cloudName'),
      api_key: config.getOrThrow<string>('cloudinary.apiKey'),
      api_secret: config.getOrThrow<string>('cloudinary.apiSecret'),
      secure: true,
    });
  }

  uploadImage(file: Express.Multer.File, entityFolder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `${this.folder}/${entityFolder}`, resource_type: 'image' },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) return reject(error ?? new Error('Cloudinary upload returned no result'));
          resolve(result);
        },
      );
      stream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(`Cloudinary delete returned ${result.result}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete Cloudinary asset ${publicId}`, error);
      throw new ServiceUnavailableException('Unable to delete image from Cloudinary');
    }
  }
}
