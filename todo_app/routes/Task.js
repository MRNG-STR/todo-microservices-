const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Task = require("../model/Task");
const auth = require("../middleware/auth");
const axios = require("axios");
// const { now } = require("mongoose");

/**
 * @method - POST
 * @param - /addtask
 * @description - Add Task
 */
router.post(
    "/addtask", auth.verifytoken,
    [
        check("taskname", "Please Enter a Valid Task name")
            .not()
            .isEmpty(),
        check("expiry", "Please Enter a Valid date")
            .not()
            .isEmpty(),
        check("description", "Please Enter a Valid description")
            .not()
            .isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        let {
            taskname,
            expiry,
            description,
            status = 'INPROGRESS',
            userid = '',
            username = ''
        } = req.body;

        try {
            const token = req.header("token");
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                token: `${token}`
            };
            const data = JSON.stringify({
                name: taskname
            });
            await axios.post('http://localhost:4000/user/getuserdetail', data, {
                headers: headers
            })
                .then((result) => {
                    // console.log(result.data)
                    userid = result.data._id
                    username = result.data.username
                })
                .catch((error) => {
                    console.error(error)
                })

            addtask = new Task({
                taskname,
                expiry,
                description,
                status,
                userid,
                username,
                updatedAt: new Date()
            });
            await addtask.save();

            res.status(200).json({
                status: "Task added successfully"
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.get("/getusertasks", auth.verifytoken, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        console.log(req.user)
        const user = await Task.find({ userid: req.user.id });
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});
router.post(
    "/updatetask", auth.verifytoken,
    [
        check("taskname", "Please Enter a Valid Task name")
            .not()
            .isEmpty(),
        check("expiry", "Please Enter a Valid date")
            .not()
            .isEmpty(),
        check("description", "Please Enter a Valid description")
            .not()
            .isEmpty(),
        check("taskid", "Please Enter a Valid id")
            .not()
            .isEmpty(),
        check("status", "Please Enter a Valid status")
            .not()
            .isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            taskname,
            expiry,
            description,
            taskid,
            status
        } = req.body;

        try {

            var result = await Task.findOneAndUpdate({
                "_id": taskid
            }, {
                "taskname": taskname,
                "description": description,
                "expiry": expiry,
                "status": status
            });
            if (result) {
                res.status(200).json({
                    status: "Task updated successfully"
                });
            } else {
                res.status(200).json({
                    status: "Task not found"
                });
            }


        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);
router.post(
    "/deletetask", auth.verifytoken,
    [
        check("status", "Please Enter a Valid status")
            .not()
            .isEmpty(),
        check("taskid", "Please Enter a Valid id")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            status,
            taskid
        } = req.body;

        try {

            var result = await Task.findOneAndUpdate({
                "_id": taskid
            }, {
                "status": status
            });
            if (result) {
                res.status(200).json({
                    status: "Task deleted successfully"
                });
            } else {
                res.status(200).json({
                    status: "Task not found"
                });
            }


        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);
router.get("/getusertrash", auth.verifytoken, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        console.log(req.user)
        const user = await Task.find({ userid: req.user.id, status: 'deleted' });
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});
router.get("/getuserexpired", auth.verifytoken, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        console.log(req.user)
        const user = await Task.find({ userid: req.user.id, status: 'expired' });
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});
module.exports = router;
