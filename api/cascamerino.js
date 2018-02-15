"use strict";
var router = require("express").Router();
var http = require("http");

router.get("/", function (req, res) {
    http.get("http://www.comune.camerino.mc.it/avvisi-cms/contributo-autonoma-sistemazione-liquidazioni-2/", (resp) => {

        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            //Il sito segnala qualora ci sia un errore nella sua connessione.
            if (!data.includes("Errore")) {

                var paginaHashata = require('crypto').createHash('md5').update(data).digest("hex");

                var fs = require('fs');

                fs.readFile("./tempBuffer", "utf8", (err, dataRead) => {
                    if (err) throw err;
                    else {

                        console.log(dataRead);
                        console.log(paginaHashata);

                        if (dataRead == paginaHashata) {
                            res.status(200).send({
                                "success": true,
                                "msg": "The page hasnt changed."
                            });
                        } else {
                            //Page has changed
                            console.log("Page has changed.");
                            fs.writeFile("./tempBuffer", paginaHashata, function (err) {
                                if (err) throw err;
                                else {
                                    //Time to notify some users
                                    console.log("New hash of the page is saved.");
                                    //got my mailer initializzed
                                    var nodemailer = require('nodemailer');
                                    var transporter = nodemailer.createTransport({
                                        service: "gmail",
                                        auth: {
                                            user: "myfreakinmailer@gmail.com",
                                            pass: "sdfsdfsdfsdf"
                                        }
                                    });
                                    let mailOptions = {
                                        from: "myfreakinmailer@gmail.com",
                                        to: "",
                                        subject: "Aggiornamenti Contributo di Autinoma Sistemazione",
                                        text: "Ci sono stati aggiornamenti nel contributo di autonoma sistemazione, la invitiamo a controllare la corrente situazione."
                                    };
                                    fs.readFile("./mailList", "utf8", function (errorWhileReadingMailList, mailList) {
                                        if (errorWhileReadingMailList) {
                                            throw errorWhileReadingMailList;
                                            res.status(500).send({ "success": false, "msg": "There was an error while triying to read the mail list" });
                                        }
                                        else {
                                            mailOptions.to += mailList;

                                            transporter.sendMail(mailOptions, (error, info) => {
                                                if (error) {
                                                    return console.log(error);
                                                }
                                                console.log('Message sent: %s', info.messageId);
                                                res.status(200).send({
                                                    "success": true,
                                                    "msg": "Mail sent to the subscribers.",
                                                    "data": mailOptions
                                                });
                                            });
                                        }
                                    })


                                }
                            });
                        }
                    }
                });
            } else {
                console.log(data);
                res.status(200).send({
                    "success": false,
                    "msg": "Something is not correct, the response contained the word error."
                });
            }
        });
    });
});

module.exports = router;
