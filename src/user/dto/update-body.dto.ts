import { IsAlpha, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBodyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsAlpha()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsAlpha()
  lastName?: string;
}
