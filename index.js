const mysql = require("mysql");

const url = 'https://jsonplaceholder.typicode.com/users';
let time = performance.now();
time = performance.now() - time;
console.log('Время выполнения скрипта = ', time);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'user_records'
});

async function getUsers(url) {
    const response = await fetch(url);
    const result = await response.json();
    return result.reduce((acc, item) => {
        const {id, name, username, email, address, phone, price = Math.floor(Math.random() * 100)} = item;
        address.city = undefined;
        acc.push([id, name, username,
            email, address.city, phone, price]);
        return acc
    }, []);
}

    db.connect(async (err) => {
        if (err) {
            console.log('Error occurred..', err)
        } else {
            console.log('MySQL Connected...')
            let values = await getUsers(url);

            //Insert data from the database
            let query = `INSERT INTO user_records.users (id, name, username, email, city, phone, price) VALUES ?`;
            db.query(query, [values], function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Insert to DB");
                }
            })
        }
        //Retrieving data from the database
        const query = `SELECT * FROM user_records.users WHERE price = (SELECT MAX(price) FROM users)`;
        db.query(query, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results)
            }
        })
    });

// DELETE all data from Database
/*db.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        db.query(`DELETE FROM user_records.users`, function (err, result, fields) {
            if (err) {
                console.log(err);
            }
        })
    }
})*/








