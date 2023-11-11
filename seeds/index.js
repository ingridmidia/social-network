const connection = require('../config/connection');
const { User, Thought } = require('../models');

const userSeedData = require('./userSeedData.json');
const thoughtSeedData = require('./thoughtSeedData.json');

connection.once("open", async function () {

    // Create users
    await User.insertMany(userSeedData);

    // Create thoughts
    await Thought.insertMany(thoughtSeedData);

    // Find users to associate thoughts and friends
    const maggie = await User.findOne({ "username": "maggie" });
    const alice = await User.findOne({ "username": "alice" });
    const nucita = await User.findOne({ "username": "nucita" });

    // Find thoughts to be associated
    const maggieThought = await Thought.findOne({ "username": "maggie" });
    const aliceThought = await Thought.findOne({ "username": "alice" });
    const nucitaThought = await Thought.findOne({ "username": "nucita" });

    // Add thoughts and friend to each user
    maggie.thoughts.push(maggieThought._id);
    maggie.friends.push(alice._id);
    await maggie.save();

    alice.thoughts.push(aliceThought._id);
    alice.friends.push(nucita._id);
    await alice.save();

    nucita.thoughts.push(nucitaThought._id);
    nucita.friends.push(maggie._id);
    await nucita.save();

    process.exit(0);
});