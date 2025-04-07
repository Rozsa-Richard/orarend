import sqlite from 'sqlite3'
const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []){
    return new Promise((resolve,reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet(sql, params=[]){
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) =>{
            if (err) reject(err);
            else resolve(row);
        });
    });
}

export function dbRun(sql, params = []){
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err){
            if (err) reject(err);
            else resolve(this);
        });
    });
}

export async function initializeDatabase(){
    await dbRun("DROP TABLE IF EXISTS orarend");
    await dbRun("CREATE TABLE IF NOT EXISTS orarend (id INTEGER PRIMARY KEY AUTOINCREMENT, day STRING, classNumber INTEGER, className STRING)");

    const classes = [
        {day: "Hetfő", classNumber: 1, className: "Matek"},
        {day: "Hetfő", classNumber: 2, className: "Angol"},
        {day: "Hetfő", classNumber: 3, className: "Tesi"},
        {day: "Hetfő", classNumber: 4, className: "Tesi"},
        {day: "Hetfő", classNumber: 5, className: "Nyelvtan"},

    ]
    for (const i of classes){
        await dbRun("INSERT INTO orarend (day,classNumber,className) VALUES (?, ?, ?);",[i.day, i.classNumber, i.className])
    }
}