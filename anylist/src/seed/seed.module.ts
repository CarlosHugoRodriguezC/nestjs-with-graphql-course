import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { ConfigModule } from '@nestjs/config';
import { ListItemModule } from '../list-item/list-item.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    UsersModule,
    ItemsModule,
    ListsModule,
    ListItemModule,
    ConfigModule,
  ],
})
export class SeedModule {}
