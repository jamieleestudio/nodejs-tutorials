export const ORDER_DOMAIN_SERVICE = Symbol("ORDER_DOMAIN_SERVICE");
export interface OrderDomainService {
  validateUserForOrder(userId: string): Promise<{ id: string; name: string; email: string }>;
}