const pool = require('../config/dbConfig'); // Assure-toi que le chemin est correct
const bcrypt = require('bcrypt');

class Student {
    // Créer un nouvel étudiant
    static async create(name, email, password_hash, group_id = null) {
        try {
            // Hacher le mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password_hash, saltRounds);

            // Exécuter la requête INSERT
            const [row] = await pool.execute(
                `INSERT INTO students (name, email, password_hash, group_id) VALUES (?, ?, ?, ?)`,
                [name, email, hashedPassword, group_id]
            );

            // Retourner l'ID de l'étudiant créé
            return row.insertId;
        } catch (error) {
            console.error(`Error creating student: ${error.message}`);
            throw new Error("Failed to create student");
        }
    }

    // Mettre à jour un champ spécifique d'un étudiant
    static async updateField(id, field, value) {
        // Liste des champs autorisés
        const allowedFields = ["name", "email", "password_hash", "group_id"];
        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field: ${field}`);
        }

        try {
            // Hacher le mot de passe si le champ est "password_hash"
            if (field === "password_hash") {
                const saltRounds = 10; // Nombre de tours de hachage
                value = await bcrypt.hash(value, saltRounds);
            }

            // Construire et exécuter la requête
            const query = `UPDATE students SET ${field} = ? WHERE id = ?`;
            const [result] = await pool.execute(query, [value, id]);

            // Vérifier si la mise à jour a réussi
            if (result.affectedRows === 0) {
                throw new Error(`Student with ID ${id} not found or no changes made`);
            }

            // Retourner l'étudiant mis à jour
            const updatedStudent = await this.getById(id);
            return updatedStudent;
        } catch (error) {
            console.error(`Error updating student field: ${error.message}`);
            throw new Error("Failed to update student field");
        }
    }

    // Récupérer un étudiant par son ID
    static async getById(id) {
        try {
            const [students] = await pool.execute(
                "SELECT * FROM students WHERE id = ?",
                [id]
            );

            if (students.length === 0) {
                throw new Error(`Student with ID ${id} not found`);
            }

            return students[0]; // Retourner le premier étudiant trouvé
        } catch (error) {
            console.error(`Error fetching student by ID: ${error.message}`);
            throw new Error("Failed to fetch student");
        }
    }

    // Rechercher un étudiant par son email
    static async searchByEmail(email) {
        try {
            const [result] = await pool.execute(
                `SELECT * FROM students WHERE email = ?`,
                [email]
            );

            if (result.length > 0) {
                return result[0]; // Retourner le premier étudiant trouvé
            }

            return null; // Aucun étudiant trouvé
        } catch (error) {
            console.error(`Error searching student by email: ${error.message}`);
            throw new Error("Failed to search student by email");
        }
    }
}

module.exports = Student;
