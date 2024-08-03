import { Router } from "express";
import { authController, callbackController, isLoggedIn, userInfo } from "../controllers/twitter.controller";

export const route = Router();

route.get("/twitter/auth", authController);
route.get("/twitter/callback", callbackController);
route.get('/user/info', userInfo);
route.get("/user/isLoggedIn", isLoggedIn)

export default route;