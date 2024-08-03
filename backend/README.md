# zkFetch demo backend

express server to handle twitter auth and generate zkp using zkFetch

## Getting Started

First, clone the repo and install the dependencies:

```bash
npm install 
# or
yarn 
```

Then, create a `.env` file in the root of the project and add the following:

```bash
CLIENT_ID =  # Twitter API client ID
CLIENT_SECRET =  # Twitter API client secret
APP_ID = # reclaim protocol app id
APP_SECRET =  # reclaim protocol app secret
CALLBACK_URL =  # callback url for twitter auth
SECRET =  # secret for jwt
NODE_ENV = # development or production
CLIENT_URL = # client url
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
```
