import { getDecodeUserId } from '../auth/authHandler.mjs'

export function getUserId(event) {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  return getDecodeUserId(jwtToken);
}
