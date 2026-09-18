import { IsBoolean } from 'class-validator';
export class UpdateServiceAvailabilityDto { @IsBoolean() available!: boolean; }
