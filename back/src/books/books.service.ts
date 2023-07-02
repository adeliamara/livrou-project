import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Author } from 'src/authors/entities/author.entity';
import { User } from 'src/users/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

 
  async create(createBookDto: CreateBookDto, user: User): Promise<Book> {
    if(!user.isAdmin){
      throw new UnauthorizedException();
    }

    const { authorNames, ...bookData } = createBookDto;
  
    const book = this.bookRepository.create(bookData);
  
    const authors = [];
    for (const authorName of authorNames) {
      let author = await this.authorRepository.findOne({ where: { name: authorName } });
  
      if (!author) {
        author = this.authorRepository.create({ name: authorName });
        await this.authorRepository.save(author);
      }
  
      authors.push(author);
    }
  
    book.authors = authors;
    return this.bookRepository.save(book);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Book>> {
    const paginationResult = await paginate<Book>(this.bookRepository, options, {
      join: {
        alias: 'book',
        leftJoinAndSelect: {
          authors: 'book.authors',
        },
      },
    });
  
    const booksWithAuthors = paginationResult.items.map(book => {
      const authors = book.authors.map(author => {
        return {
          author_id: author.author_id,
          name: author.name,
        };
      });
  
      return {
        ...book,
        authors: authors,
      };
    });
  
    return {
      ...paginationResult,
      items: booksWithAuthors,
    };
  }

  async findAll() {
    const books = await this.bookRepository
    .createQueryBuilder('book')
    .leftJoinAndSelect('book.authors', 'author') // Carrega os dados dos autores associados
    .getMany();

  const booksWithAuthors = books.map(book => {
    const authors = book.authors.map(author => {
      return {
        author_id: author.author_id, 
        name: author.name, 
      };
    });
  })
}

  
async findOne(id: number): Promise<Book> {
  const book = await this.bookRepository
    .createQueryBuilder('book')
    .leftJoinAndSelect('book.authors', 'author') // Carrega os dados dos autores associados
    .where('book.book_id = :id', { id })
    .getOne();

  if (!book) {
    throw new NotFoundException(`Livro com o ID ${id} não encontrado`);
  }

  const authors = book.authors.map(author => {
    return {
      author_id: author.author_id,
      name: author.name,
    };
  });

  return {
    ...book,
    authors: authors,
  };
}




  update(id: number, updateBookDto: UpdateBookDto, user: User) {
    if(!user.isAdmin){
      throw new UnauthorizedException();
    }
    return `This action updates a #${id} book`;
  }

  remove(id: number, user: User) {
    if(!user.isAdmin){
      throw new UnauthorizedException();
    }
    return `This action removes a #${id} book`;
  }
}
