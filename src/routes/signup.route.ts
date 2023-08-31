import express from 'express';
import CreateUser from "@/controllers/signup/create-user.controller";
import CreateProject from "@/controllers/signup/create-project.controller";
import jwt from 'jsonwebtoken';
import {TError, TUser, TProject} from '@/types/types';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { email, password } = req.body;

    const userData: TError | TUser = await CreateUser({
      email,
      password
    });
    if (isErrorUser(userData)) {
      return res.json(userData);
    }

    const userId = userData.id;

    const projectData: TError | TProject = await CreateProject({userId, name: 'Default'});
    if (isErrorProject(projectData)) {
      return res.json(projectData);
    }

    const projectId = projectData.id;
    const tokenProject = jwt.sign({userId, projectId}, process.env.JWT_SECRET as string);

    res.json({accessToken: tokenProject});
  } catch(e) {
    throw new Error('Signup Error')
  }
});

function isErrorUser(data: TError | TUser): data is TError {
  return !!(data as TError).error;
}
function isErrorProject(data: TError | TProject): data is TError {
  return !!(data as TError).error;
}

export default router;