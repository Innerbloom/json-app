const mysql = require("mysql");
const express = require('express');
const app = require("request");

const url = 'https://jsonplaceholder.typicode.com/users';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'user_records'
});

async function getUsers(url) {
    const response = await fetch(url);
    const result = await response.json();
    const usersID = result.reduce((acc, item) => {
        const { id, name, username, email, address, phone } = item;
        acc.push([id, name, username,
            email, address.city, phone]);
        return acc
    }, [])
    //console.log(usersID);
    return usersID;
}


    db.connect(async (err) => {
        if (err) {
            console.log('Error occurred..', err)
        } else {
            console.log('MySQL Connected...')
            let values = await getUsers(url);
            let query = `INSERT INTO user_records.users (id, name, username, email, city, phone) VALUES ?`;
            db.query(query, [values], function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Insert to DB" + result)
                }
            })
        }
    });




