import { OrderStatus } from '@prisma/client';

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.NEW]: [OrderStatus.PENDING_PAYMENT, OrderStatus.DEFICIENCY, OrderStatus.CANCELED],
  [OrderStatus.DEFICIENCY]: [OrderStatus.PENDING_PAYMENT, OrderStatus.DEFICIENCY, OrderStatus.CANCELED],
  [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PREPARED, OrderStatus.CANCELED],
  [OrderStatus.PREPARED]: [OrderStatus.READY, OrderStatus.CANCELED],
  [OrderStatus.READY]: [OrderStatus.PICKED, OrderStatus.DELIVERED, OrderStatus.CANCELED],
  [OrderStatus.PICKED]: [OrderStatus.DELIVERED, OrderStatus.CANCELED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELED]: [],
};

export class OrderStateMachine {
  static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const allowed = TRANSITIONS[from];
    return allowed?.includes(to) ?? false;
  }

  static assertCanTransition(from: OrderStatus, to: OrderStatus): void {
    if (!this.canTransition(from, to)) {
      throw new Error(
        `Invalid status transition: ${from} → ${to}. Allowed transitions from ${from}: [${TRANSITIONS[from]?.join(', ') ?? ''}]`,
      );
    }
  }

  static availableTransitions(from: OrderStatus): OrderStatus[] {
    return TRANSITIONS[from] ?? [];
  }

  static isTerminal(status: OrderStatus): boolean {
    return status === OrderStatus.DELIVERED || status === OrderStatus.CANCELED;
  }
}
