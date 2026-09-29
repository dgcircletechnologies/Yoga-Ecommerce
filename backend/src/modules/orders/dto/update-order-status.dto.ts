import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  status!: string;
}
