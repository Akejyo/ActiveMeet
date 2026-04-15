import express from 'express';
const router = express.Router();

//* Temporary data
import { followingList } from './sampleData.js';

router.get('/', (req, res) => {
  res.render('following', {
    title: 'Following',
    following: followingList
  });
});

export default router;