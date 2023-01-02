import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String, {
    description: 'Hola Mundo es lo que regresa',
    name: 'hello',
  })
  helloWorld(): string {
    return `Hola Mundo`;
  }

  @Query(() => Float, { description: 'Return a random number', name: 'random' })
  getRandomNumber(): number {
    return Math.random() * 100;
  }

  @Query(() => Int, {
    description: 'Return a random number from zero to',
    name: 'randomFromZeroTo',
  })
  getRandomFromZeroTo(
    @Args('to', { type: () => Int, nullable: true }) to: number = 10,
  ): number {
    return Math.round(Math.random() * to);
  }
}
