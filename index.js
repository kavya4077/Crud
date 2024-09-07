const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app=express();
app.use(cors({origin: true}));

app.get("/", (req, res) => {
  return res.status(200).send("hi hi hi");
});
const db=admin.firestore();
const ts=Date.now();

app.post("/api/create", (req, res) => {
  (async () =>{
    try {
      await db.collection("employees").doc(`${ts}`).create({
        id: Date.now(),
        name: req.body.name || "",
        email: req.body.email || "",
        position: req.body.position || "",
      });
      return res.status(200).send({status: "Success", message: "Emp created"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "failed", message: error.message});
    }
  })();
});

app.get("/api/get/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("employees").doc(req.params.id);
      const userData = await reqDoc.get();
      const response = userData.data();

      return res.status(200).send({status: "Success", message: "Data fetched",
        data: response});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "failed", message: error.message});
    }
  })();
});

app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("employees").doc(req.params.id);
      await reqDoc.delete();

      return res.status(200).send({status: "Success", message: "Data updated"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "failed", message: error.message});
    }
  })();
});

app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("employees").doc(req.params.id);
      await reqDoc.delete();
      return res.status(200).send({status: "Success", message: "Data deleted"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "failed", message: error.message});
    }
  })();
});


exports.app=functions.https.onRequest(app);
