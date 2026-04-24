import postsData from "../data/posts.js";
import { users } from "../config/mongoCollections.js";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const userCollection = await users();

    const user = {
        firstName: "Test",
        lastName: "User",
        email: "test@test.com"
    };

    const insertUser = await userCollection.insertOne(user);
    const userId = insertUser.insertedId.toString();

    try {
        const post = await postsData.createPost(
            "Pickup Game",
            userId,
            "basketball",
            "Casual basketball game",
            new Date("2026-12-01T15:00:00"),
            10,
            { min: 18, max: 30 },
            "intermediate",
            "co-ed",
            "Central Park"
        );

        console.log("CREATE POST:", post);

        const postId = post._id.toString();

        console.log("GET POST:", await postsData.getPostById(postId));

        console.log("GET ALL POSTS:", await postsData.getAllPosts());

        const withComment = await postsData.addComment(
            postId,
            userId,
            "I want to join!"
        );

        console.log("ADD COMMENT:", withComment);

        const commentId = withComment.comments[0].commentId.toString();

        console.log("LIKE POST:", await postsData.likePost(postId, userId));

        console.log("DISLIKE POST:", await postsData.dislikePost(postId, userId));

        console.log("UPDATE POST:", await postsData.updatePost(
            postId,
            "Soccer Match",
            "soccer",
            "Casual soccer game",
            new Date("2026-12-02T15:00:00"),
            12,
            { min: 18, max: 35 },
            "all levels",
            "co-ed",
            "Hoboken Field",
            "open"
        ));

        console.log("REMOVE COMMENT:", await postsData.removeComment(postId, commentId));

        console.log("REMOVE POST:", await postsData.removePost(postId));
    } catch (e) {
        console.log("ERROR:", e);
    }

    await closeConnection();
};

main();