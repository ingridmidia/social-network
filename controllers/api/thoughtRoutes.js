const router = require('express').Router();
const { Thought, User } = require('../../models');

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

// Get one thought by its id
router.get("/:thoughtId", async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID!' });
        }
        res.status(200).json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add a new thought
router.post("/", async (req, res) => {
    try {
        const thought = await Thought.create(req.body);

        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: thought._id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Thought created, but no user with this ID!' });
        }

        res.status(200).json(thought);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Update a thought by its id
router.put("/:thoughtId", async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { new: true }).select('-__v');
        if (!thought) {
            return res.status(404).json({ message: 'No thought with this ID!' });
        }
        res.status(200).json(thought);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Delete a thought by its id
router.delete("/:thoughtId", async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) {
            return res.status(404).json({ message: 'No thought with this ID!' });
        }
        const user = await User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Deleted thought, but no user with this id!' });
        }

        res.status(200).json({ message: 'Thought deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Add a new reaction
router.post("/:thoughtId/reactions", async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $push: { reactions: req.body } }, { runValidators: true, new: true }).select('-__v');
        if (!thought) {
            return res.status(404).json({ message: 'No thought with this ID!' });
        }
        res.status(200).json(thought);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Delete reaction
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true }).select('-__v');
        if (!thought) {
            return res.status(404).json({ message: 'No thought with this ID!' });
        }
        res.status(200).json(thought);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;