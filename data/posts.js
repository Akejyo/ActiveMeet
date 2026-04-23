//TODO functions to add, delete, ... from database

import { posts } from "../config/mongoCollections.js";
import { checkAuthorId, checkTitle, checkSport, checkDescription, checkDateAndTime,
    checkMaxParticipants, checkAgeRestrictions, checkSkillLevelRestriction, 
    checkGenderRestriction, checkLocation, checkComment, checkPostId, checkCommentId,
    checkStatus
} from "../helpers.js";
import { ObjectId } from "mongodb";

const exportedMethods ={
    async createPost(title, authorId, sport, description, eventDateTime, 
        maxParticipants, ageRestriction, skillLevelRestriction, genderRestriction, location){
        title = checkTitle(title);
        authorId = await checkAuthorId(authorId);
        sport = checkSport(sport);
        description = checkDescription(description);
        eventDateTime = checkDateAndTime(eventDateTime);
        maxParticipants = checkMaxParticipants(maxParticipants);
        ageRestriction = checkAgeRestrictions(ageRestriction);
        skillLevelRestriction = checkSkillLevelRestriction(skillLevelRestriction);
        genderRestriction = checkGenderRestriction(genderRestriction);
        location = checkLocation(location);
        let newPost = {
            authorId: authorId,
            sport: sport,
            title: title,
            description: description,
            eventDateTime: eventDateTime,
            createdAt: new Date(),
            maxParticipants: maxParticipants,
            acceptedParticipantIds: [],
            pendingRequestIds: [],
            ageRestriction: ageRestriction,
            skillLevelRestriction: skillLevelRestriction,
            genderRestriction: genderRestriction,
            location: location,
            comments: [],
            likedBy: [],
            dislikedBy: [],
            status: "open"
        };
        let posts1 = await posts()
        let iRes = await posts1.insertOne(newPost)
        if (!iRes.acknowledged || !iRes.insertedId) throw 'Could not add post'
        let ret = await posts1.findOne({_id: iRes.insertedId})
        return ret;
    },
    // Returns post associated with postId
    async getPostById(postId){
        postId = await checkPostId(postId);
        const postsCollection = await posts();
        const post = await postsCollection.findOne({_id: new ObjectId(postId)});
        if(post === null) throw `Error: no post found with PostId: ${postId}`;
        return post;
    },
    // Returns all posts
    async getAllPosts(){
        const postsCollection = await posts();
        return await postsCollection.find({}).toArray();
    },
    // Create comment
    async addComment(postId, authorId, comment){
        postId = await checkPostId(postId)
        authorId = await checkAuthorId(authorId)
        comment = await checkComment(comment)
        let posts1 = await posts()
        let updateRes = await posts1.updateOne({_id: new ObjectId(postId)}, {$push: {comments: 
            {
                commentId: new ObjectId(), 
                userId: authorId, 
                commentText: comment, 
                commentedAt: new Date()
            }}})
        if (!updateRes.acknowledged || updateRes.modifiedCount === 0) throw 'Could not add comment'
        let ret = await posts1.findOne({_id: new ObjectId(postId)})
        return ret;
    },
    // Remove comment
    async removeComment(postId, commentId){
        postId = await checkPostId(postId);
        commentId = await checkCommentId(commentId);
        const postsCollection = await posts();
        const update = await postsCollection.updateOne({_id: new ObjectId(postId)}, 
        {$pull: {comments: {commentId: new ObjectId(commentId)}}});
        if(!update.acknowledged || update.modifiedCount === 0) throw "Error: Could not remove comment";
        return await this.getPostById(postId);
    },
    // Update Post
    async updatePost(postId, title, sport, description, eventDateTime, maxParticipants, ageRestriction, skillLevelRestriction, genderRestriction, location, status){
        postId = await checkPostId(postId);
        title = checkTitle(title);
        sport = checkSport(sport);
        description = checkDescription(description);
        eventDateTime = checkDateAndTime(eventDateTime);
        maxParticipants = checkMaxParticipants(maxParticipants);
        ageRestriction = checkAgeRestrictions(ageRestriction);
        skillLevelRestriction = checkSkillLevelRestriction(skillLevelRestriction);
        genderRestriction = checkGenderRestriction(genderRestriction);
        location = checkLocation(location);
        status = checkStatus(status);

        const updateObj = {
            title,
            sport,
            description,
            eventDateTime, 
            maxParticipants,
            ageRestriction,
            skillLevelRestriction,
            genderRestriction,
            location,
            status
        };

        const postsCollection = await posts();
        const update = await postsCollection.updateOne(
            {_id: new ObjectId(postId)},
            {$set: updateObj}
        );
        if(!update.acknowledged || update.modifiedCount === 0) throw "Error: Could not update post";
        return await this.getPostById(postId);
    },
    async removePost(postId){
        postId = checkPostId(postId);
        const postsCollection = await posts();
        const remove = await postsCollection.findOneAndDelete(
            {_id: new ObjectId(postId)}
        );
        if(!remove) throw "Error: Post could not be removed";
        return {deleted: true};
    }
};

export default exportedMethods;