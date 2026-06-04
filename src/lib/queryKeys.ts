/**
 * TanStack Query key factories for all Piper data.
 *
 * Rules:
 * - All keys are arrays (never strings) for fine-grained invalidation.
 * - Include all dependencies that affect the result in the key.
 * - Use the factory pattern so invalidation is consistent.
 */

export const streamKeys = {
  /** Invalidates all stream queries */
  all: () => ['streams'] as const,

  /** All streams sent by an address */
  sent: (address: string) => ['streams', 'sent', address] as const,

  /** All streams received by an address */
  incoming: (address: string) => ['streams', 'incoming', address] as const,

  /** Single stream detail */
  detail: (streamId: string) => ['streams', 'detail', streamId] as const,

  /** Event log for a stream */
  events: (streamId: string) => ['streams', 'events', streamId] as const,
} as const;

export const coinKeys = {
  /** Coin balance for an address and coin type */
  balance: (address: string, coinType: string) =>
    ['coins', 'balance', address, coinType] as const,
} as const;
