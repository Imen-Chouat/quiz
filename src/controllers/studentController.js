import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import Student from '../modules/Student.js';


// student registration 
const registerStudent = async (req,res)=>{
    try {

         const {name , surname , email , password , promo_name , section_name , group_name} = req.body ;
         const emailExist = await Student.seachByEmail(email);
        if(emailExist){
           return res.status(400).send({"message" : "Email already exists ."}) ;
        }
        const [promo] = await pool.execute("SELECT id FROM promo WHERE promo_name = ?", [promo_name]);
        if (promo.length === 0) {
            throw new Error("Promo non trouvée !");
        }
        const promo_id = promo[0].id;
        const [section] = await pool.execute("SELECT id FROM sections WHERE section_name = ? AND class_id = ?", [section_name, promo_id]);
        if (section.length === 0) {
            throw new Error("Section non trouvée !");
        }
        const section_id = section[0].id;
        const [group] = await pool.execute("SELECT id FROM groups WHERE groupe_name = ? AND section_id = ?", [group_name, section_id]);
        if (group.length === 0) {
            throw new Error("Groupe non trouvé !");
        }
        const group_id = group[0].id;

        const password_hash = bcryptjs.hash(password,8);
        const newID = Student.create(name,surname,email,password_hash , group_id);
        const student = Student.getById(newID);
        return res.status(201).json(student);
    } catch (error) {
        return res.status(404).send({"message":"problem registering a student"});
    }
};


//login for student 
const loginStudent = async (req,res)=>{ // hna just ydekhel l email w lpassword no need llgroup 
    try {
        const {email, password} = req.body ;
        const student = await Student.seachByemail(email);
        if(student){
            const isMatch = await bcryptjs.compare(password,student.password);
            if(!isMatch){
                return res.status(400).json({"message":"wrong password"});
            }
            const token = jwt.sign({id : teacher.id , email : teacher.email},envConfig.JWT_SECRET,{expiresIn : '24h'});
            return res.status(201).json({"message":"student loged in successfully !",token});
        }else{
            return res.status(400).json({"message":"Email not found"});
        }

    } catch (error) {
        console.error(error);
    }
};
const modify_Name = async (req,res) =>{
    try {
        const {id , newName } = req.body ;
        const student = await Student.getById(id);
        if(!student){
            return res.status(404).json({"message":"Wrong id"});
        }
        const modified = await Student.update_name(id, newName);
        if(modified > 0) {
            student = await Student.getById(id);
            return res.status(200).json({"message" : "The name modified successfully",student});
        }
        return res.status(400).json({"message":"Failling in modifying the name !"});
    }catch(error){
        console.error("Error modifying teacher name:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}
const modify_SurName = async (req,res) =>{
    try {
        const {id , newSurName } = req.body ;
        const student = await Student.getById(id);
        if(!student){
            return res.status(404).json({"message":"Wrong id"});
        }
        const modified = await Student.update_surname(id, newSurName);
        if(modified > 0) {
            student = await Student.getById(id);
            return res.status(200).json({"message" : "The surname modified successfully",student});
        }
        return res.status(400).json({"message":"Failling in modifying the surname !"});
    }catch(error){
        console.error("Error modifying student surname:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}
const modify_password = async (req,res) =>{
    try {
        const {id , new_password} = req.body ;
        const student = await Student.getById(id);
        if(!student){
            return res.status(404).json({"message":"Wrong id"});
        }
        const modified = await Student.update_password(id, new_password);
        if(modified > 0) {
            student = await Student.getById(id);
            return res.status(200).json({"message" : "The password modified successfully",student});
        }
        return res.status(400).json({"message":"Failling in modifying the password !"});
    }catch(error){
        console.error("Error modifying student password :", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const modify_groupid = async (req,res) =>{
        try{
        const { id , new_promo , new_section , new_group} = req.body ;
        const student = await Student.getbyId(id);
        if (!student){
            return res.status(404).json({"message":"Wrong id"});
        }
        const [promo] = await pool.execute("SELECT id FROM promo WHERE promo_name = ?", [new_promo]);
        if (promo.length === 0) {
            throw new Error("NewPromo non trouvée !");
        }
        const promo_id = promo[0].id;
        const [section] = await pool.execute("SELECT id FROM sections WHERE section_name = ? AND promo_id = ?", [new_section, promo_id]);
        if (section.length === 0) {
            throw new Error("Section non trouvée !");
        }
        const section_id = section[0].id;
        const [group] = await pool.execute("SELECT id FROM groups WHERE groupe_name = ? AND section_id = ?", [new_group, section_id]);
        if (group.length === 0) {
            throw new Error("Groupe non trouvé !");
        }
        const new_group_id = group[0].id;
        const modified = await Student.update_groupid(id, new_group_id);
        if(modified > 0) {
            student = await Student.getById(id);
            return res.status(200).json({"message" : "The group_id  modified successfully",student});
        }
        return res.status(400).json({"message":"Failling in modifying the group_id  !"});
        }catch(error){
            console.error("Error modifying student group_id  :", error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
}

export default {
    registerStudent ,
    loginStudent ,
    modify_Name , 
    modify_SurName ,
    modify_password , 
    modify_groupid ,

};
