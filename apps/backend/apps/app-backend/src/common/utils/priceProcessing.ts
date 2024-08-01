import { CreateCommand_ServiceType } from '@app-backend/commands/dto/create-command.dto';

/**
 * Compute the partial total price after applying a discount.
 *
 * @param {Array<{service: Service, quantity: number}>} services - the list of services and their quantities
 * @return {number} the total price after applying the discount
 */
export function computeTotalPartial(
  services: { service: CreateCommand_ServiceType; quantity: number }[],
): number {
  return services.reduce(
    (acc, { quantity, service }) => acc + service.price * quantity,
    0,
  );
}
