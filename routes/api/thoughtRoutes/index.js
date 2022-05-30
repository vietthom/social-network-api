const router = require('express').Router();
const { 
    createThought,
    getAllThoughts,
    getThoughtById,
    updateThoughtById,
    deleteThoughtById,
    addReactions,
    removeReactions
} = require('../../../controllers/thoughtController');

router
    .route('/')
    .post(createThought)
    .get(getAllThoughts)

router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThoughtById)
    .delete(deleteThoughtById)

router
    .route('/:thoughtId/reactions')
    .post(addReactions)

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(removeReactions)

module.exports = router;