import express from 'express';
import quizControllers from '../controllers/quizController.js';

const router = express.Router();

router.post('/quizzes', quizControllers.createQuiz);
router.delete('/quizzes/:id', quizControllers.deleteQuiz);
router.put('/quizzes/:id', quizControllers.updateQuiz);// hna put parce que bdelt kolch 
export default router;
