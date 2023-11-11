const router = require('express').Router();
const { Thought } = require('../../models');

// Get all thoughts
router.get("/", async (req, res) => {
    try {
        const thoughts = await Thought.find().select('-__v');
        res.status(200).json(thoughts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;