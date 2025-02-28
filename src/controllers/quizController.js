import Quiz from '../modules/Quiz.js';

// Create a new quiz
const createQuiz = async (req, res) => {
    try {
        const { teacher_id, title, module, etat, timed_by, duration_minutes } = req.body;
        const [teacher] = await pool.execute(
            `SELECT id FROM teachers WHERE id = ?`,
            [teacher_id]
        );

        if (teacher.length === 0) {
            throw new Error(`Teacher with ID ${teacher_id} does not exist.`);
        }

        const quizId = await Quiz.create(teacher_id, title, module, etat, timed_by, duration_minutes);
        const quiz = await Quiz.findById(quizId);

        return res.status(201).json({ message: "Quiz created successfully.", quiz });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return res.status(500).json({ message: "Failed to create quiz. Please try again later." });
    }
};

// Delete a quiz 
const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id)
        if(!quizr){
            return res.status(404).json({"message":"Wrong id"});
        }
        const isDeleted = await Quiz.delete(id);
        if (isDeleted) {
            return res.status(200).json({ message: "Quiz deleted successfully." });
        } else {
            return res.status(404).json({ message: "Quiz not found." });
        }
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return res.status(500).json({ message: "Failed to delete quiz. Please try again later." });
    }
};

// Update hna dert just lcas te3 l'utilisateur rah ydekhel kamel les infos meme itha kan baghi ybdel une seul info
const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, module, status, timed_by, duration_minutes } = req.body;
        const quiz = await Quiz.findById(id)
        if(!quizr){
            return res.status(404).json({"message":"Wrong id"});
        }
        const isUpdated = await Quiz.update(id, title, module, status, timed_by, duration_minutes);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
        }
};

export default {
    createQuiz,
    deleteQuiz,
    updateQuiz,
};
