import express from 'express';
const router = express.Router();

//TODO: For all posts routes, modify handlebars to show different things based on owner of post.

//* Temporary data
import { samplePosts } from './sampleData.js';
// TODO: Now is temporary route, need POST and other motifies.

router.get('/create', (req, res) => {  //TODO both get and post routes
  res.render('post/postCreate', { title: 'Create Post' });
});


router.get('/:id', (req, res) => { //TODO both get and post routes
  const postId = req.params.id;
  res.render('post/postDetail', {
    title: 'Post Detail',
    post: samplePosts.find(p => p.id === parseInt(postId)),
    comments: []
  });
});

router.post('/:id/like', (req, res) => {
  // TODO: Implement the logic for liking a post
});

router.post('/:id/dislike', (req, res) => {
  // TODO: Implement the logic for disliking a post
});

// TODO: Add a POST route for processing a request to join a post.
router.post('/:id/join', (req, res) => {
  // TODO: Implement the logic for joining a post
});

router.get('/:id/edit', (req, res) => { //TODO both get and post routes
    const postId = req.params.id;
    res.render('post/postEdit', {
        title: 'Edit Post',
        post: samplePosts.find(p => p.id === parseInt(postId))
    });
});

export default router;