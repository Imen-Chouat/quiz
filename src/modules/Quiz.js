import mysql from 'mysql2';
import pool from '../config/dbConfig.js';

static async create(teacher_id, title, module ,etat, timed_by , duration_minutes) {
    
    try {
    
        const [result] = await pool.execute(
            `INSERT INTO quizzes (teacher_id, title, module, status, timed_by, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)`,
            [teacher_id, title, module, etat, timed_by, duration_minutes]
        );

        return result.insertId;
    } catch (error) {
        console.error(`Error creating quiz: ${error.message}`);
        throw new Error("Failed to create quiz. Please try again later.");
    }
}


    static async delete(quizId) {
        try {
            const [result] = await pool.execute(`DELETE FROM quizzes WHERE id = ?`, [quizId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting quiz:", error);
            return false;
        }
    }

    static async update(quizId, title, module, etat, timed_by, duration_minutes) {
        try {
            const [result] = await pool.execute(
                `UPDATE quizzes SET title = ?, module = ?, status = ?, timed_by = ?, duration_minutes = ? WHERE id = ?`,
                [title, module, etat, timed_by, duration_minutes, quizId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating quiz:", error);
            return false;
        }
    }

    static async findById(quizId) {
        try {
            const [quiz] = await pool.execute(`SELECT * FROM quizzes WHERE id = ?`, [quizId]);
            return quiz[0];
        } catch (error) {
            console.error("Error finding quiz:", error);
            return null;
        }
    }

    static async findAll() {
        try {
            const [quizzes] = await pool.execute(`SELECT * FROM quizzes`);
            return quizzes;
        } catch (error) {
            console.error("Error finding quizzes:", error);
            return [];
        }
    }


module.exports = Quiz;
