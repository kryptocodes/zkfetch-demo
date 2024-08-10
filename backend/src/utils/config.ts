import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';

// Load environment variables
dotenv.config();

export const TOKENS = {
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
};

// Create client used to generate auth links only
export const requestClient = new TwitterApi({ ...TOKENS });
