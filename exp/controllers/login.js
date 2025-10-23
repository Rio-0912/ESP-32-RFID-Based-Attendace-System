// login logic to be implemented here

const db = require("../db");

const login = async(req, res) =>{
    try {
        const {email, password} = req.body;
        console.log("Login attempt for:", email);
        const query = "SELECT * FROM student WHERE email = ? AND pass = ?";
        db.query(query, [email, password], (err, results) =>{
            if(err){
                console.error("Database error during login:", err);
                return res.status(500).json({error: "Database error"});
            }
            if(results.length === 0){
                console.log("Invalid credentials for:", email);
                return res.status(401).json({message: "Invalid credentials"});
            }

            const user = results[0];
            if(user.email == email && user.pass == password){
                console.log("User authenticated:", user.uid);
                return res.status(200).json({message: "Login successful", uid: user.uid, name: user.name});
            }
        })




        
    } catch (error) {
        console.error("Login error:", error);
    }
}

module.exports = login;