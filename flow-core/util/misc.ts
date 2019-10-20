import { BelongsToType, ByPlayer } from '../types';

export const belongsToPlayer = (
  belongsTo: BelongsToType
): belongsTo is ByPlayer => {
  // Cast to ByPlayer to have type-checking.
  return !!(belongsTo as ByPlayer).playerId;
};
