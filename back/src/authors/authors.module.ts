import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { Author } from './entities/author.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Author])], // Importa o repositório BookRepository
  controllers: [AuthorsController],
  providers: [AuthorsService]
})
export class AuthorsModule {}
