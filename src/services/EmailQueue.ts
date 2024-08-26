
import { Email } from '../types';

export class EmailQueue {
  private queue: { id: string; email: Email }[] = [];

  enqueue(id: string, email: Email): void {
    this.queue.push({ id, email });
  }

  dequeue(): { id: string; email: Email } | undefined {
    return this.queue.shift();
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}