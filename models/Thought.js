const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        defaultValue: ()=> new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
    }, 
    username: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: DataTransfer.now,
        get: (createdAtVal) => 
        moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a")
    }
},
{
    toJSON: {
        getters: true
    },
    id: false
})

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: true,
            maxLength: 280, 
            minlength: 1
        }, 
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).formate('MMM DD, YYYY [at] hh:mm a')
        },
        username: {
            type: String,
            required: true
        ,
    reactions: [ReactionSchema]}
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

thoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;