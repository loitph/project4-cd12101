import { decode } from 'jsonwebtoken';

export function getDecodeUserId(jwtToken) {
  return decode(jwtToken).sub;
}
