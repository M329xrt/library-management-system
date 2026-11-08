import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  @Min(1)
  genreId: number;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
