import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { User } from '../users/entities/user.entity';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listsRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User) {
    const newList = await this.listsRepository.create({
      ...createListInput,
      user,
    });

    await this.listsRepository.save(newList);

    return newList;
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listsRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search)
      queryBuilder.andWhere(`  LOWER("name") LIKE :name `, {
        name: `%${search.toLowerCase()}%`,
      });

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!list) throw new NotFoundException(`List with id ${id} not found`);

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User) {
    await this.findOne(id, user);
    const list = await this.listsRepository.preload(updateListInput);

    if (!list) throw new NotFoundException(`List with id ${id} not found`);

    await this.listsRepository.save(list);

    return list;
  }

  async remove(id: string, user: User) {
    const list = await this.findOne(id, user);

    await this.listsRepository.remove(list);

    return { ...list, id };
  }
}
