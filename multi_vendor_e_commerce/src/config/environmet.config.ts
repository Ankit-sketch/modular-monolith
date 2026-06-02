export type TEnvironmet = 'DEV' | 'TESTING' | 'PROD' | 'STAGING' | 'QA' | 'UAT';

export type TThrottlerConfig = {
  short: { ttl: number; limit: number };
  medium: { ttl: number; limit: number };
  long: { ttl: number; limit: number };
};

// Wrap everything inside a single default function
export default () => ({
  environmentConfig: (process.env.ENVIRONMENT || 'DEV') as TEnvironmet,

  throttlerConfig: {
    short: {
      ttl: parseInt(process.env.THROTTLE_SHORT_TTL || '1000', 10),
      limit: parseInt(process.env.THROTTLE_SHORT_LIMIT || '3', 10),
    },
    medium: {
      ttl: parseInt(process.env.THROTTLE_MEDIUM_TTL || '10000', 10),
      limit: parseInt(process.env.THROTTLE_MEDIUM_LIMIT || '20', 10),
    },
    long: {
      ttl: parseInt(process.env.THROTTLE_LONG_TTL || '60000', 10),
      limit: parseInt(process.env.THROTTLE_LONG_LIMIT || '100', 10),
    },
  },

  jwtConfig: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: '7d',
  },
});
