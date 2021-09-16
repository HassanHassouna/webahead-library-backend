const db = require("../../database/connection");
const bcrypt = require("bcryptjs");

function volunteerSignupController(req, res) {
  const adminData = req.body;
  const password = adminData.password;
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hash) => {
      db.query(`SELECT * FROM volunteers WHERE email=$1`, [adminData.email])  // 
        .then((data) => {
          if (!data.rows.length) {
            db.query(`INSERT INTO volunteers(email,password) VALUES ($1, $2)`, [adminData.email, hash])
              .then((result) => {
                res.send({ success: true, message: "Registration is done!" });
              })

              .catch((error) => {
                res.send({ success: false, message: "Something went wrong" });
              });

          } else {
            res.send({ success: false, message: "Email is already exists" });
          }
        })
    })
}

module.exports = { volunteerSignupController };