const passport = require('passport');
const strategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signup', new strategy({
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true
}, async (req, username, password, done) => {
   const { fullname } = req.body;

   let newUser = {
      username,
      password,
      fullname
   };
  try{
     newUser.password = await helpers.encryptPassword(password);
     const result = await pool.query('INSERT INTO users SET ?', [newUser]);
     newUser.id = result.insertId;

   }catch(e){
      console.log(e);

   }
   
   return done(null, newUser);
  
}));

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
   done(null, rows[0]);
});