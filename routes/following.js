//This route should be done
import express from 'express';
const router = express.Router();

//* Temporary data
// import { followingList } from './sampleData.js';
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
          status: "Following"
        }
        following.push(obj)
      }
      res.render('following', {
        title: 'Following',
        logedIn: true,
        following: following
      })
    }catch(e){
      console.log(e)
      res.status(400).json({ error: e });
    }
  }
});

export default router;