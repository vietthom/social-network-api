const res = require('express/lib/response');
const { User, Thought } = require('../models');

module.exports = {
    createThought: async (req, res) => {
        const { thoughtText, username, userId } = req.body;
        try {
            const newThought = await Thought.create({
                thoughtText,
                username,
                userId
            })
                .then(({_id}) => {
                    return User.findOneAndUpdate(
                        { _id: userId },
                        { $push: { thoughts: _id} },
                        { new: true, runValidators: true}
                    );
                })
                .then((thoughtData) => {
                    res.json(thoughtData);
                })
        } catch (error) {
            console.log(error);
        }
    },
    getAllThoughts: async (req, res) => {
        try {
            const thoughts = await Thought.find().populate({
                path: 'username'
            });
            res.json(thoughts);
        } catch (error) {
            res.json(error);
        }
    }, 
    getThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const thought = await Thought.findById(thoughtId);
            res.json(thought);
        } catch (error) {
            res.json(error);
        }
    }, 
    updateThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                {...req.body},
                {
                    new: true,
                    runValidators: true
                }
            );
            res.json(updatedThought);
        } catch (error) {
            res.json(error);
        }
    }, 
    addReactions: async (req, res) => {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$push: { reactions: req.body}}
            )
                .populate({
                    path:'reactions',
                    select: '-__v'
                })
                .select('-__v')
                .then((userData) => {
                    if(!userData){
                        res.status(404).json({message:'No Thought found with this id.'});
                        return;
                    }
                    res.json(userData);
                })
        } catch (error) {
            res.json(error);
        }
    }, 
    removeReactions: async (req, res) => {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id:req.params.thoughtId},
                {$pull: {reactions: {reactionId: req.params.reactionId}}}
            )
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then((userData)=>{
                if(!userData){
                    res.status(404).json({message: 'No Thought found with this id.'});
                    return;
                }
                res.json(userData);
            });
        } catch (error) {
            res.json(error);
        }
    },
    deleteThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
          const deletedThought = await Thought.findByIdAndDelete(thoughtId);
          res.json(deletedThought);
        } catch (error) {
          res.json(error);
        }
    }
};