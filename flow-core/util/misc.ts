import { BelongsToType, ByPlayer, ByObstacle, ByCity } from '../types';

export const belongsToPlayer = (
  belongsTo: BelongsToType
): belongsTo is ByPlayer => {
  // Cast to ByPlayer to have type-checking.
  return !!(belongsTo as ByPlayer).playerId;
};

export const belongsToObstacle = (
  belongsTo: BelongsToType
): belongsTo is ByObstacle => {
  // Cast to ByPlayer to have type-checking.
  return !!(belongsTo as ByObstacle).obstacleType;
};

export const belongsToCity = (
  belongsTo: BelongsToType
): belongsTo is ByCity => {
  // Cast to ByPlayer to have type-checking.
  return !!(belongsTo as ByCity).cityName;
};
