import express from "express";

import getEnvs from "./config/getEnvs";
import connectDb from "./config/connectDb";
import userRoutes from "./routes/userRoutes";

const app = express();

<<<<<<< HEAD
const {DB_URI, DB_NAME, PORT} = getEnvs();

app.use('/users', userRoutes);

connectDb(DB_URI, DB_NAME)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
=======
app.get('/a', (req, res) => {
    res.send('???');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
>>>>>>> 1ad8615 (ci: add new configs)
});
