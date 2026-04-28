import {
    createPost,
    getPostById,
    getAllPosts,
    addComment,
    removeComment,
    updatePost,
    removePost,
    likePost,
    dislikePost
} from "../data/posts.js";

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

    let postId;
    let commentId;

    const runFailTest = async (name, fn) => {
        try {
            await fn();
            console.log(`${name}: FAILED, should have thrown`);
        } catch (e) {
            console.log(`${name}: passed, threw error:`, e);
        }
    };

    try {
        const post = await createPost(
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

        postId = post._id.toString();

        console.log("CREATE POST:", post);

        console.log("GET POST:", await getPostById(postId));

        console.log("GET ALL POSTS:", await getAllPosts());

        const withComment = await addComment(
            postId,
            userId,
            "I want to join!"
        );

        commentId = withComment.comments[0].commentId.toString();

        console.log("ADD COMMENT:", withComment);

        console.log("LIKE POST:", await likePost(postId, userId));

        console.log("DISLIKE POST:", await dislikePost(postId, userId));

        console.log(
            "UPDATE POST:",
            await updatePost(
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
            )
        );

        // Failure / edge case tests

        await runFailTest("Invalid post id", async () => {
            await getPostById("123");
        });

        await runFailTest("Invalid comment removal", async () => {
            await removeComment(postId, "badid");
        });

        await runFailTest("Empty comment", async () => {
            await addComment(postId, userId, "");
        });

        // Like twice should not duplicate user
        await likePost(postId, userId);
        const likedPost = await likePost(postId, userId);

        console.log(
            "DOUBLE LIKE TEST:",
            likedPost.likedBy.length === 1
                ? "passed"
                : "FAILED"
        );

        console.log(
            "REMOVE COMMENT:",
            await removeComment(postId, commentId)
        );

        console.log("REMOVE POST:", await removePost(postId));

        await runFailTest("Delete nonexistent post", async () => {
            await removePost(postId);
        });

    } catch (e) {
        console.log("ERROR:", e);
    }

    await closeConnection();
};

main();