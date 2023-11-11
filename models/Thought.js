const { Schema, model } = require('mongoose');
const dayjs = require("dayjs");

// Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: { type: String, required: true, minlength: 1, maxlength: 280 },
        createdAt: {
            type: Date, default: Date.now,
            get: function (createdAtData) {
                const customFormat = 'MMM D[th], YYYY [at] h:mm A';
                const formattedDate = dayjs(createdAtData, { parseFormat: 'MMM Do, YYYY [at] h:mm a' }).format(customFormat);
                return formattedDate;
            }
        },
        username: { type: String, required: true },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Create a virtual property `reactionCount` that gets the amount of reactions per thought
postSchema.virtual('reactionCount').get(function () {
    return this.reaction.length;
});

// Initialize Thought model
const Thought = model("thought", thoughtSchema);

module.exports = Thought;