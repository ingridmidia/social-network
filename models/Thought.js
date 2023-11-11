const { Schema, model, Types } = require('mongoose');
const dayjs = require("dayjs");

// Reaction schema used as the reaction field's subdocument schema in the Thought model.
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: { type: String, required: true, maxlength: 280 },
        username: { type: String, required: true },
        createdAt: {
            type: Date, default: Date.now,
            get: function (createdAtData) {
                const customFormat = 'MMM D[th], YYYY [at] h:mm A';
                const formattedDate = dayjs(createdAtData, { parseFormat: 'MMM Do, YYYY [at] h:mm a' }).format(customFormat);
                return formattedDate;
            }
        }
    }
);

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
            getters: true
        },
        id: false,
    }
);

// Create a virtual property `reactionCount` that gets the amount of reactions per thought
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reaction.length;
});

// Initialize Thought model
const Thought = model("thought", thoughtSchema);

module.exports = Thought;