import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.book.findMany({
      include: { genre: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async create(dto: CreateBookDto) {
    try {
      return await this.prisma.book.create({
        data: {
          title: dto.title,
          author: dto.author,
          isbn: dto.isbn,
          genreId: dto.genreId,
          publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
          available: dto.available ?? true,
        },
        include: { genre: true },
      });
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? (error as { code?: string }).code
          : undefined;

      if (code === 'P2002') {
        throw new ConflictException('A book with this ISBN already exists');
      }
      if (code === 'P2003') {
        throw new BadRequestException('The selected genre does not exist');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);

    try {
      return await this.prisma.book.update({
        where: { id },
        data: {
          ...dto,
          publishedAt: dto.publishedAt
            ? new Date(dto.publishedAt)
            : undefined,
        },
        include: { genre: true },
      });
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? (error as { code?: string }).code
          : undefined;

      if (code === 'P2002') {
        throw new ConflictException('A book with this ISBN already exists');
      }
      if (code === 'P2003') {
        throw new BadRequestException('The selected genre does not exist');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.book.delete({
      where: { id },
    });

    return { message: `Book ${id} deleted successfully` };
  }
}
