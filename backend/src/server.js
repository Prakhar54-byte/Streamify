import express from 'express';
import "dotenv/config";

import authRoutes from './routes/auth.route.js';

const app = express()
const PORT=process.env.PORT || 5001

//noob
// app.get("/api/auth/signup", (req, res) => {
//     res.send("SignUp  World")
// }
// )
// app.get("/api/auth/login", (req, res) => {
//     res.send("login  World")
// }
// )
// app.get("/api/auth/logout", (req, res) => {
//     res.send("logout  World")
// }
// )


app.use("/api/auth/",authRoutes)
app.listen(5001, () => {
    console.log(`Server is running on port ${PORT}`);
})