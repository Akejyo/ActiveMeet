import express from 'express';
const router = express.Router();
import { ObjectId } from 'mongodb';
import { posts, users } from '../config/mongoCollections.js';

//TODO: For all posts routes, modify handlebars to show different things based on owner of post.

//* Temporary data
import { samplePosts } from './sampleData.js';

router.route('/create').get((req, res) => {  //TODO post route
  if (!req.session.user) {
    return res.redirect('/profile/login');
  } else {
    res.render('post/postCreate', { title: 'Create Post', logedIn: true });
  }
})
.post((req, res) => {
  // TODO: Implement the logic for creating a new post
});


router.route('/:id').get(async (req, res) => { //TODO both get and post routes
  if (!req.session.user) {
    return res.redirect('/profile/login');
  } else {
    const postId = req.params.id;
    try {
      let posts1 = await posts()
      let post = await posts1.findOne({ _id: new ObjectId(postId) });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      let users1 = await users();
      let user = await users1.findOne({ _id: new ObjectId(post.authorId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      let requestUsers = [];
      for (let i = 0; i < post.pendingRequestIds.length; i++) {
        let requestUser = await users1.findOne({ _id: new ObjectId(post.pendingRequestIds[i]) });
        if (requestUser) {
          requestUsers.push({ id: requestUser._id, name: `${requestUser.firstName} ${requestUser.lastName}` });
        }
      }
      let post2 = {
        id: post._id,
        sport: post.sport,
        title: post.title,
        author: user.firstName + ' ' + user.lastName,
        authorId: post.authorId,
        location: post.location,
        date: post.eventDateTime.toLocaleDateString(),
        time: post.eventDateTime.toLocaleTimeString(),
        skill: post.skillLevelRestriction,
        ageRange: `${post.ageRestriction.min}-${post.ageRestriction.max}`,
        gender: post.genderRestriction,
        description: post.description,
        likes: post.likedBy.length,
        accepted: post.acceptedParticipantIds,
        // hasRequests: (post.pendingRequestIds.length > 0),
        requests: requestUsers
      }
      let comments = [];
      for (let i = 0; i < post.comments.length; i++) {
        let author = await users1.findOne({ _id: new ObjectId(post.comments[i].userId) });
        comments.push({
          id: post.comments[i]._id,
          author: author.firstName + ' ' + author.lastName,
          content: post.comments[i].commentText
        });
      }
      let isAuthor = post.authorId === req.session.user._id;
      res.status(200).render('post/postDetail', { title: 'Post Detail', 
        post: post2, comments: comments, isAuthor: isAuthor });
    }catch(e) {
      return res.status(500).json({ error: `An error occurred: ${e}`});
    }
  }
})
.post((req, res) => {
  // TODO: Implement the logic for posting a comment
  res.redirect(`/posts/${req.params.id}`)
});

router.get('/:id/like', (req, res) => {
  // TODO: Implement the logic for liking a post
  res.redirect(`/posts/${req.params.id}`)
});

router.get('/:id/dislike', (req, res) => {
  // TODO: Implement the logic for disliking a post
  res.redirect(`/posts/${req.params.id}`)
});

// TODO: Add a POST route for processing a request to join a post.
router.get('/:id/join', (req, res) => {
  // TODO: Implement the logic for joining a post
  res.redirect(`/posts/${req.params.id}`);
});

router.get('/:id/accept/:userId', (req, res) => {
  // TODO: Implement the logic for accepting a request to join a post
  res.redirect(`/posts/${req.params.id}`);
});

router.get('/:id/decline/:userId', (req, res) => {
  // TODO: Implement the logic for declining a request to join a post
  res.redirect(`/posts/${req.params.id}`);
});

router.get('/:id/decline/:userId', (req, res) => {
  // TODO: Implement the logic for declining a request to join a post
  res.redirect(`/posts/${req.params.id}`);
});

router.route('/:id/edit').get(async(req, res) => { //TODO both get and post routes
    const postId = req.params.id;
    res.render('post/postEdit', { //Delete this and replace with actual logic
        title: 'Edit Post',
        post: samplePosts.find(p => p.id === parseInt(postId))
    });
})
.post((req, res) => {
    // TODO: Implement the logic for updating a post
    res.redirect(`/posts/${req.params.id}`);
});

export default router;