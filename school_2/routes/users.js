import { Router } from 'express';

import authorize from '../middleware/auth.middleware.js'
import { getUser, updateUser } from '../controllers/user.controller.js'

const userRouter = Router();


userRouter.get('/:id', getUser);

userRouter.put('updateuser/:id', updateUser);

// userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

// userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));

// userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));

export default userRouter;