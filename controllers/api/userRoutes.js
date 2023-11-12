const router = require('express').Router();
const { User, Thought } = require('../../models');

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get one user by its id
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId }).select('-__v').populate(["thoughts", "friends"]);
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID!' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add a new user
router.post("/", async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Update a user by its id
router.put("/:userId", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true });
        if (!user) {
            return res.status(404).json({ message: 'No user with this ID!' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Delete a user by its id and associated thoughts
router.delete("/:userId", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'No user with this ID!' });
        }
        await Thought.deleteMany({ "username": user.username });
        res.status(200).json({ message: 'User and thoughts deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Add a new friend
router.post("/:userId/friends/:friendId", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ "_id": req.params.userId }, { $push: { friends: req.params.friendId } }, { new: true } );
        if (!user) {
            res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Delete a friend
router.delete("/:userId/friends/:friendId", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ "_id": req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json({ message: 'Friend deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;