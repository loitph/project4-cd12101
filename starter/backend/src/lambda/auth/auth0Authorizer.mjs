import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth');
const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJOW+hxRZozb/NMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi0xcW1odTBibmVrbXFlbWVwLnVzLmF1dGgwLmNvbTAeFw0yNDA2MjIw
MzQ5MzlaFw0zODAzMDEwMzQ5MzlaMCwxKjAoBgNVBAMTIWRldi0xcW1odTBibmVr
bXFlbWVwLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAK/DDMB+OMA8MlJv6qAY0pDpnkXtRHZdVVU6C2tkNiHksR4xJVovBms3z90a
ZHW6E/i8/G74arJSK1moalxHtnvdl1pig9NfuYR/xkM8THKK6B16SAH7InyZQeBU
upAXI1C7tM1Fu+9Qel1nhgGp00Z4LzQqyJR6CmYFf1EQP5wkfKXcR2DxJOzv1e49
qw4yw1AKSCP1A3Ftx2wWBIAIXSXVr8mQwnEBBZ2CPwDiHvFL9sSL62bwlS0S/uLI
tPUm23lQX36AUFLExlmrNjyuM+Nl1W+aN+v0s0NmAdHIazauqJsyN26OUGltR6Gg
lEtsNENToST7iWfL8fP9rGafUvECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUVw+cPjNCYHyWCltoCXKdigpmJ5UwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQB8lVLwGDRlJNLhWpEkob6Fq2u1rHFVyC0Ef0nq61JP
Pz0tq58zmHM+V+v91VkhzFBQuuwRR3dzQJHyn9nRSkcB0qreiupCeE4Cb+P/DA2K
BB00+7CCRq9kCjBbCaSS+4QkxvXC6ReQ8l7n24/kd7EJqc09q7+fGv1TyfASSt2M
KXNtFtmj6JytmWgUuIR1d+o3UcgUuxRPvT0r3U9zyY8TyDNyl4Q4kwqk1vfJXx8j
qdv00Fheg7/VfFRZ05aBRNrZEKqayxCSjiRi3sSeA7FOVm6sNxjjsgpQX92rEaDq
sWovkl+RtEsv0djHN86cRJzxkTc9Jq4aLrufGSjedeo/
-----END CERTIFICATE-----`;

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('[L] > Authorized successfully - token: ', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('[L] > Authorized failed - message: ', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  if (!authHeader) {
    throw new Error('Authorized header was not found');
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Authorized header is incorrect');
  }

  const token = getToken(authHeader);
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] });
}

function getToken(authHeader) {
  if (!authHeader) {
    throw new Error('Authorized header was not found');
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Authorized header is incorrect');
  }

  return authHeader.split(' ')[1];
}
