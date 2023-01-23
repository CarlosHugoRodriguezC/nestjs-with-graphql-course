import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<Boolean> {
    if (this.isProd)
      throw new UnauthorizedException('We cannot run Seed on production');

    // TODO: Clear database
    await this.deleteDatabase();
    // TODO: Create Users
    const user = await this.loadUsers();
    // TODO: Create Items
    await this.loadItems(user);
    return true;
  }

  async deleteDatabase() {
    // TODO delete items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    // TODO delete users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    // const items = SEED_ITEMS.map((item) => ({...item, user}));

    // await this.itemsRepository.insert(items);

    const itemPromises: Promise<Item>[] = [];

    for (const item of SEED_ITEMS) {
      itemPromises.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemPromises);
  }
}
