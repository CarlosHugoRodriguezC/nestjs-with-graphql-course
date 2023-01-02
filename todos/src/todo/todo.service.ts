import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput, UpdateTodoInput } from './dtos/inputs';
import { StatusArgs } from './dtos/args';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    {
      id: 1,
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      done: false,
    },
    {
      id: 2,
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      done: false,
    },
  ];

  get totalTodos() {
    return this.todos;
  }
  get completedTodos() {
    return this.todos.filter((todo) => todo.done);
  }
  get pendingTodos() {
    return this.todos.filter((todo) => !todo.done);
  }

  findAll(statusArgs: StatusArgs): Todo[] {
    const { status } = statusArgs;
    if (status !== undefined)
      return this.todos.filter((todo) => todo.done === status);
    return this.todos;
  }

  findOne(id): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) throw new NotFoundException(`Todo with ${id} not found`);
    return todo;
  }

  create(createTodoInput: CreateTodoInput): Todo {
    const todo = new Todo();
    todo.description = createTodoInput.description;
    (todo.done = false),
      (todo.id = Math.max(...this.todos.map((todo) => todo.id)) + 1);
    this.todos.push(todo);
    return todo;
  }

  update(id: number, updateTodoInput: UpdateTodoInput) {
    const { description, done } = updateTodoInput;
    const todoToUpdate = this.findOne(id);

    if (description) todoToUpdate.description = description;

    if (done !== undefined) todoToUpdate.done = done;

    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return todoToUpdate;
      }
      return todo;
    });

    return todoToUpdate;
  }

  delete(id: Number) {
    const todo = this.findOne(id);
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return true;
  }
}
