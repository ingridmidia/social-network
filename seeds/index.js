const connection = require('../config/connection');
const { User, Thought } = require('../models');

const userSeedData = require('./userSeedData.json');
const thoughtSeedData = require('./thoughtSeedData.json');

connection.once("open", async function () {
    const userCollection = await User.find({}).exec();
    if (userCollection.length === 0) {
        await User.insertMany(userSeedData);
        console.log('Users inserted');
    } else {
        console.log('Users already populated');
    }
    
    const thoughtCollection = await Thought.find({}).exec();
    if (thoughtCollection.length === 0) {
        await Thought.insertMany(thoughtSeedData);
        console.log('Thoughts inserted');
    } else {
        console.log('Thougts already populated');
    }
    
    process.exit(0);
});

