import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, { name: 'executeSeed' })
  async executeSeed(): Promise<Boolean> {
    return this.seedService.executeSeed();
  }
}
