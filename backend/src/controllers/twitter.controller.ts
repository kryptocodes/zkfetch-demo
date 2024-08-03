import { Response } from "express";
import { TwitterApi } from "twitter-api-v2";
import { TOKENS, requestClient } from "../utils/config";
import { asyncWrapOrError } from "../utils/errorHandler";
import { ReclaimClient } from "@reclaimprotocol/zk-fetch";

const CALLBACK_URL = process.env.CALLBACK_URL!;
const OAUTH2_SCOPES = [
  "tweet.read",
  "users.read",
];
const reclaimClient = new ReclaimClient(process.env.APP_ID!, process.env.APP_SECRET!);



export const authController = asyncWrapOrError(async (req: any, res: Response) => {
  const { url, codeVerifier, state } = requestClient.generateOAuth2AuthLink(
    CALLBACK_URL,
    { scope: OAUTH2_SCOPES }
  );
  req.session.state = state;
  req.session.codeVerifier = codeVerifier;
  res.redirect(url);
});

export const callbackController = asyncWrapOrError(async (req: any, res: Response) => {
  const { state, code } = req.query;
  const { codeVerifier, state: sessionState } = req.session;

  if (!codeVerifier || !state || !sessionState || !code) {
    return res.status(400).send("You denied the app or your session expired!");
  }
  if (state !== sessionState) {
    return res.status(400).send("Stored tokens didnt match!");
  }

  const tempClient = new TwitterApi({ ...TOKENS });
  const { accessToken, refreshToken, expiresIn } = await tempClient.loginWithOAuth2({ 
    code: code as string, 
    codeVerifier, 
    redirectUri: CALLBACK_URL 
  });

  req.session.accessToken = accessToken;
  req.session.refreshToken = refreshToken;
  req.session.expiresIn = expiresIn;
  return res.redirect("http://localhost:3000");
});

export const userInfo = asyncWrapOrError(async (req: any, res: Response) => {
  const { accessToken } = req.session;
  if(!accessToken) {
    return res.status(401).send('unauthorized');
  }
  const url = 'https://api.twitter.com/2/users/me';
  /* 
  * Generate a proof that the user has access to the Twitter account (https://api.twitter.com/2/users/me)
  * The proof should include the username of the Twitter account that the user has access to.
  */ 
  const proof = await reclaimClient.zkFetch(url, {
    // public options for the fetch request 
    method: 'GET',
  }, {
    // secret options for the proof generation
    headers: {
      // this access token won't be visible in the proof data
      'Authorization': 'Bearer ' + accessToken
    },
    responseMatches: [
      /* search for the username in the response body */
      // this regex will capture the username from the response body 
      {
        type: 'regex',
        value: '"username":"(?<username>[^\"]+)"'
      }
    ],
    responseRedactions: [
      /* redact the username from the response body */ 
      {
        jsonPath: '$.data.username',
      }
    ]
  });

  if(!proof) {
    return res.status(500).send('Failed to generate proof');
  }
  // Transform the proof data to be used on-chain 
  const proofData = await ReclaimClient.transformForOnchain(proof);
  return res.status(200).json({ proofData, proof });
});


export const isLoggedIn = asyncWrapOrError(async (req: any, res: Response) => {
  if(req.session.accessToken) {
    return res.status(200).json({ loggedIn: true });
  }
  return res.status(200).json({ loggedIn: false });
});

