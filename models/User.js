const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: { type: String, unique: true, required: true, trim: true },
        email: { type: String, unique: true, required: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
        thoughts: [{ type: Schema.Types.ObjectId, ref: "thought" }],
        friends: [{ type: Schema.Types.ObjectId, ref: "user" }]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Create a virtual property `friendCount` that gets the amount of friends per user
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// Initialize User model
const User = model("user", userSchema);

module.exports = User;