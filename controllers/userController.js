const { User, Thought } = require('../models');
const { isEmail } = require('validator');

module.exports = {
    createUser: async (req,res) => {
        const { username, email} = req.body;
        if(!isEmail(email)) {
            return res.status(401).json({error: 'Email must be a valid email address'});
        }
        try {
            const newUser = await User.create({
                username,
                email
            });
            res.json(newUser);
        } catch (error) {
            res.json(error);
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find()
                .populate({
                    path: 'thoughts',
                    select: '-__v'
                })
                .select('-__v')
                .sort({_id: -1});
                res.json(users);
        } catch (error) {
            res.json(error);
        }
    },
    getUserById: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await User.findById(userId);
            res.json(user);
        } catch (error) {
            res.json(error);
        }
    },
    updateUserById: async (req, res) => {
        const { userId } = req.params;
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {...req.body},
                {
                    new: true,
                    runValidators: true
                }
            );
        } catch (error) {
            res.json(error)
        }
    },
    addFriend: async (req, res) => {
        const { userId, friendId } = req.params;
        try {
            const user1= await User.findOneAndUpdate(
                {_id: userId}, 
                { $push: { friends: friendId} },
                { new:true, runValidators: true }
            ).populate({
                path: 'friends',
                select: '-__v'
            });

            const user2 = await User.findOneAndUpdate(
                { _id: params.id },
                { $push: { friends: params.friendId } },
                {new:true, runValidators: true }
            ).populate({
                path: 'friends',
                select: '-__v',
            })
                .select('-__v')
                .then((userData)=>{
                    if (!userData) {
                        res.status(404).json({ message: 'No user found with this id!' });
                        return;
                    }
                    res.json(userData);
                })
        } catch (error) {
            res.json(error);
        }
    }, 
    deleteUserById: async (req, res) => {
        const { userId } = req.params;

        try {
            const deleteUserThoughts = await Thought.deleteMany({
                userId: userId,
            });
            const deletedUser = await User.findByIdAndDelete(userId);
            res.json(deletedUser);
        } catch (error) {
            res.json(error);
        }
    }, 
    removeFriend: async (req, res) => {
        const { userId, friendId } = req.params;

        try {
            const user1 = await User.findOneAndUpdate(
                {_id: userId},
                { $pull: { friends: friendId} },
                { new: true }
            ).populate({
                path: 'friends',
                select: '-__v',
            });
            const user2 = await User.findOneAndUpdate(
                { _id: friendId },
                { $pull: { friends: userId } },
                { new: true, runValidators: true }
            )
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .then((userData) => {
              if (!userData) {
                res.status(404).json({ message: "No User found with this id!" });
                return;
              }
              res.json(userData);
            });
        } catch (error) {
            res.json(error);
        }
    }

};