const mysql = require("mysql");
const express = require('express');
const app = require("request");

const url = 'https://jsonplaceholder.typicode.com/users';

async function getUsers(url) {
    const response = await fetch(url);
    const result = await response.json();
    const usersID = result.reduce((acc, item) => {
        const { id, name, username, email, address, phone } = item;
        acc.push([id, name, username,
            email, address.city, phone]);
        return acc
    }, [])
    console.log(usersID);
}


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'user_records'
});

db.connect((err) => {
    if (err) {
        console.log('Error occurred..', err)
    } else {
        console.log('MySQL Connected...')
        let query = "INSERT INTO user_records.users (id, name, username, email, city, phone) values?;";
        let values =getUsers(url);
        db.query(query, [values], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log("Insert to DB" + result.rowsAffected)
            }
        })
    }
});



