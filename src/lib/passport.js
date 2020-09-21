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

passport.use('local.signin', new strategy({
   usernameField:'username',
   passwordField:'password',
   passReqToCallback:true
}, async(req,username,password,done)=>{
   try{
      const rows = await pool.query('SELECT * FROM users WHERE username = ?',[username]);
      if(rows.length>0){
         const user = rows[0];
         const validPassword = await helpers.mathPassword(password, user.password);
         if(validPassword){
            done(null, user, req.flash('success','Welcome '+user.fullname));
         }else{
            done(null, false,req.flash('message','Usuario o contraseña invalidad'));
         }
      }else{
         return done(null,false,req.flash('message','Usuario o contraseña invalidad'));
      }
   }catch(e){
      console.log(e);
   }
}));

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
   done(null, rows[0]);
});