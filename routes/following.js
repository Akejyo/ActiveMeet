//This route should be done
import express from 'express';
const router = express.Router();

import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';

router.get('/', async (req, res) => {
  if (!req.session.user){
    res.redirect('/profile/login')
  } else {
    try{
      let following = []
      let users1 = await users()
      for (let a of req.session.user.followingIds){
        let user = await users1.findOne({_id: new ObjectId(a)})
        if (!user) throw "No user with that Id"
        let obj = {
          name: `${user.firstName} ${user.lastName}`,
          sports: user.sportsInterests.join(", "),
          status: "Following",
          id: user._id
        }
        following.push(obj)
      }
      let blocked = []
      for (let b of req.session.user.blockedUserIds){
        let user = await users1.findOne({_id: new ObjectId(b)})
        if (!user) throw "No user with that Id"
        let obj = {
          name: `${user.firstName} ${user.lastName}`,
          id: user._id
        }
        blocked.push(obj)
      }
      res.render('following', {
        title: 'Following',
        logedIn: true,
        following: following,
        blocked: blocked
      })
    }catch(e){
      res.status(400).render('following', { title: 'Following',
        logedIn: true,
        following: [],
        blocked: [],
        error: true, message: e });
    }
  }
});

export default router;