const mysql = require("mysql");
const express = require('express');
const app = require("request");
const e = require("express");

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
        const { id, name, username, email, address, phone,  price = Math.floor(Math.random()*100) } = item;
        acc.push([id, name, username,
            email, address.city, phone, price]);
        return acc
    }, [])
    return usersID;
}



//Insert data from the database
    db.connect(async (err) => {
        if (err) {
            console.log('Error occurred..', err)
        } else {
            console.log('MySQL Connected...')
            let values = await getUsers(url);
            let query = `INSERT INTO user_records.users (id, name, username, email, city, phone, price) VALUES ?`;
            db.query(query, [values], function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Insert to DB" + result)
                }
            })
        }
    });

//Retrieving data from the database
const query = `SELECT * FROM user_records.users WHERE price = (SELECT MAX(price) FROM users)`;
db.query(query, function (err, results) {
    if (err) {
        console.log(err);
    } else {
        console.log(results)
    }
})






