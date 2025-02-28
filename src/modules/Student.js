import mysql from 'mysql2';
import pool from '../config/dbConfig.js';
import bcryptjs from 'bcryptjs';

class Student {
    static async create(name,surname, email, password_hash, group_id = null) {
        try {
            const hashedPassword = await bcryptjs.hash(password_hash,8);

           
            const [row] = await pool.execute(
                `INSERT INTO students (name,surname, email, password_hash, group_id) VALUES (?, ?, ?, ?, ?)`,
                [name, surname, email, hashedPassword, group_id]
            );
            return row.insertId;
        } catch (error) {
            console.error(`Error creating student: ${error.message}`);
            throw new Error("Failed to create student");
        }
    }

    static async updateField(id, field, value) {
      
        const allowedFields = ["name","surname", "email", "password_hash", "group_id"];
        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field: ${field}`);
        }

        try {
        
            if (field === "password_hash") {
                value = await bcryptjs.hash(value, 8);
            }
            const query = `UPDATE students SET ${field} = ? WHERE id = ?`;
            const [result] = await pool.execute(query, [value, id]);
            if (result.affectedRows === 0) {
                throw new Error(`Student with ID ${id} not found or no changes made`);
            }
            const updatedStudent = await this.getById(id);
            return updatedStudent;
        } catch (error) {
            console.error(`Error updating student field: ${error.message}`);
            throw new Error("Failed to update student field");
        }
    }

    static async getById(id) {
        try {
            const [students] = await pool.execute(
                "SELECT * FROM students WHERE id = ?",
                [id]
            );

            if (students.length === 0) {
                throw new Error(`Student with ID ${id} not found`);
            }

            return students[0]; 
        } catch (error) {
            console.error(`Error fetching student by ID: ${error.message}`);
            throw new Error("Failed to fetch student");
        }
    }


    static async searchByEmail(email) {
        try {
            const [result] = await pool.execute(
                `SELECT * FROM students WHERE email = ?`,
                [email]
            );

            if (result.length > 0) {
                return result[0]; 
            }

            return null; 
        } catch (error) {
            console.error(`Error searching student by email: ${error.message}`);
            throw new Error("Failed to search student by email");
        }
    }
}

module.exports = Student;
