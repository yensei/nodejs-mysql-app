const express = require("express");
const router = express.Router();
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});
/*
//este no funciona no se porque
router.post('/signup', (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    });

    res.send('received');
});
*/
router.post('/signup', passport.authenticate('local', {
    successRedirect:'/profile',
    failureRedirect:'/signup',
    failureFlash:true
}
));


router.get('/profile', (req, res) => {
    res.send('authenticate success');
});


module.exports = router;