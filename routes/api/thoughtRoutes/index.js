const router = require('express').Router();
const { 
    createThought,
    getAllThoughts,
    getThoughtById,
    updateThoughtById,
    deleteThoughtById,

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
    

router
    .route('/:thoughtId/reactions/:reactionId')
    

module.exports = router;