


const express = require('express');
const { signupUser, loginUser, getUserDetails, updateUserDetails } = require('../userControllers');
// const authenticate = require('../middleware/authenticate'); // Assuming you have middleware to handle JWT

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/users', getUserDetails);
router.patch('/user/update', updateUserDetails);

module.exports = router;
