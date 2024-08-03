import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';

// Load environment variables
dotenv.config();

export const TOKENS = {
  clientId: 'MjNQdjNmQ1VZcjFpSjYyNGpNZ286MTpjaQ',
  clientSecret: 'LMh8q_sm8HEcdoxTR98g-1qBugQ7PIdEaK8_RaCLGtBBWfyXMO',
};

// Create client used to generate auth links only
export const requestClient = new TwitterApi({ ...TOKENS });
