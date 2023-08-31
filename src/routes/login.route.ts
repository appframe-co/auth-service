import express from 'express';
import GetUser from '@/controllers/login/get-user.controller';
import GetProject from "@/controllers/login/get-project.controller";
import { TError, TUser, TProject} from '@/types/types';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { email, password } = req.body;

    const userData: TError | TUser = await GetUser({
      email,
      password
    });
    if (isErrorUser(userData)) {
      return res.json(userData);
    }

    const userId = userData.id;

    const projectData: TError | TProject = await GetProject({userId});
    if (isErrorProject(projectData)) {
      return res.json(projectData);
    }

    const projectId = projectData.id;
    const tokenProject = jwt.sign({userId, projectId}, process.env.JWT_SECRET as string);

    res.json({accessToken: tokenProject});
  } catch(e) {
    throw new Error('Login Error')
  }
});

function isErrorUser(data: TError | TUser): data is TError {
  return !!(data as TError).error;
}
function isErrorProject(data: TError | TProject): data is TError {
  return !!(data as TError).error;
}

export default router;