import express from 'express';
import { getUsers, getUserById, editUser, deleteUser } from '../controller/user-controller.js';

const router = express.Router();

router.get('/', getUsers);

router.get('/:id', getUserById);
router.put('/:id', editUser);
router.delete('/:id', deleteUser);

export default router;