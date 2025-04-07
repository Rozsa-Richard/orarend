import express from 'express'
import { dbAll, initializeDatabase, dbGet,dbRun } from './Util/database.js'

const app = express()
app.use(express.json())

app.get('/timetable', async (req, res)=> {
    const timetable = await dbAll("SELECT * FROM orarend");
    res.status(200).json(timetable)
})

app.get('/timetable/:id', async (req, res) => {
    const id = req.params.id;
    const thatclass = await dbGet("SELECT * FROM orarend WHERE id=?;", [id])
    if (!thatclass) {
        return res.status(400).json({message: "Class not found"})
    }
    else {
        res.status(200).json(thatclass)
    }
})
app.get('/timetable/:day', async (req, res) => {
    const day = req.params.day;
    const thatDay = await dbAll("SELECT * FROM orarend WHERE day=?;", [day])
    if (!thatDay) {
        return res.status(400).json({message: "Day not found"})
    }
    else {
        res.status(200).json(thatDay)
    }
})

app.use((req, res, next, err) =>{
    if (err){
        res.status(500).json({message: 'Error ${err.message}'})
    }
})
app.post("/timetable", async (req, res) => {
    const {day, classNumber, className} = req.body;
    if (!day || !classNumber || !className){
        return res.status(400).json({message: "Missing some data"})
    }
    
    const result = await dbRun("INSERT INTO orarend (day,classNumber,className) VALUES (?, ?, ?);",[day, classNumber,className])
    res.status(201).json({id: result.lastID, day, classNumber, className});
})

app.put("/timetable/:id", async (req, res) => {
    const id = req.params.id;
    const thatclass = dbGet("SELECT * FROM orarend WHERE id = ?;",[id]);
    if (!thatclass){
        return res.status(404).json({message:"Class not found"});
    }
    const {day, classNumber, className} = req.body;
    if (!day || !classNumber || !className){
        return res.status(400).json({message:"Missing data"});
    }
    
    await dbRun("UPDATE orarend SET day = ?, classNumber = ?, className = ? WHERE id = ?;",[day, classNumber, className,id]);
    res.status(200).json({id,day,classNumber,className});
})

app.delete("/timetable/:id", async (req, res) => {
    const id = req.params.id;
    const thatclass = dbGet("SELECT * FROM orarend WHERE id = ?;",[id]);
    if (!thatclass){
        return res.status(404).json({message:"Missing data"});
    }
    await dbRun("DELETE FROM orarends WHERE id = ?;",[id]);
    es.status(200).json({message:"delete sucsessful"});
})

async function startServer() {
    await initializeDatabase();
    app.listen(3000, ()=> {
        console.log('Server runs on port 3000')
    })
}

startServer();