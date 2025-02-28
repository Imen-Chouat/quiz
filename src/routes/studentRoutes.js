import express from 'express';
import studentControllers from '../controllers/studentController.js';

const router = express.Router();

router.post('/register',studentControllers.registerStudent);
router.post('/login',studentControllers.loginStudent);
router.patch('/modifyName',studentControllers.modify_Name); 
router.patch('/modify_SurName',studentControllers.modify_SurName); 
router.patch('/modify_password',studentControllers.modify_password); 
router.patch('/modify_groupid',studentControllers.modify_groupid); 
export default router;
