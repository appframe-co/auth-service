import express from 'express';
import UserController from "@/controllers/user.controller";

const router = express.Router();

router.get('/', async (req, res) => {
  const { authorization: accessToken } = req.headers;

  const user = await UserController({accessToken});

  res.json({user});
});

export default router;