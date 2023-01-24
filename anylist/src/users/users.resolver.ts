import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Query,
  Args,
  Int,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { User } from './entities/user.entity';
import { List } from '../lists/entities/list.entity';
import { Item } from '../items/entities/item.entity';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { ValidRolesArgs } from './dto/args/roles.arg';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

import { UsersService } from './users.service';
import { ItemsService } from 'src/items/items.service';
import { ListsService } from '../lists/lists.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(
      validRoles.roles,
      paginationArgs,
      searchArgs,
    );
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser() currentUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin]) currentUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() SearchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, SearchArgs);
  }

  @ResolveField(() => [List], { name: 'lists' })
  async getListsByUser(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ) {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
