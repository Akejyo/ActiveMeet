import {dbConnection, closeConnection} from './config/mongoConnection.js'
import { users, posts, joinRequests, reports} from './config/mongoCollections.js'
import { createUser, addFollower } from './data/users.js'
import { createPost, addComment } from './data/posts.js'
import { createJoinRequest } from './data/joinRequests.js'
import { createReport } from './data/reports.js'
import { ObjectId } from 'mongodb'

const main = async () => {
    const db = await dbConnection()
    await db.dropDatabase()
    let user1, user2, user3 = undefined
    try{
        user1 = await createUser("Ismael", "Davila", "ismdav@example.com", "New York", 
            "NY", 30, "Male", "I love playing basketball!", ["Basketball"], "Password1!", 'public', 'intermediate');
    }catch(e){
      console.log(e)
    }
    try{
        user2 = await createUser("Neville", "Longbottom", "nev@gmail.com", "Jacksonville",
            "FL", 25, "Male", "Don't know what to write here", ["Hockey", "Soccer"], "Password2!", 'private', 'beginner');
    }catch(e){
        console.log(e)
    }
    try{
        user3 = await createUser("Pablo", "Doe", "pab@example.com", "Los Angeles",
            "CA", 35, "Male", "I am a machine!", ["Running", "Basketball"], "Password3!", 'public', 'advanced');
    }catch(e){
        console.log(e)
    }

    let post1, post2, post3 = undefined
    try{
        let dandT = new Date("2026-05-25T07:00:00Z")
        post1 = await createPost("Basketball Game", user1._id.toString(), "Basketball", "Looking for players to join a friendly basketball game this weekend!",
            dandT, 10, {min: 18, max: 120}, 'intermediate', 'co-ed', "Central Park");
    }catch(e){
        console.log(e)
    }
    try{
        let dandT2 = new Date("2026-05-20T15:00:00Z")
        post2 = await createPost("Hiking Trip", user2._id.toString(), "Hiking", "Join us for a fun hiking trip in the mountains!",
            dandT2, 5, {min: 23, max: 50}, 'beginner', 'co-ed', "Death Mountain");
    }catch(e){
        console.log(e)
    }
    try{
        let dandT3 = new Date("2026-06-15T10:00:00Z")
        post3 = await createPost("Running Group", user3._id.toString(), "Running", "Join our weekly running group!",
            dandT3, 8, {min: 25, max: 80}, 'advanced', 'co-ed', "Hoboken Waterfront");
    }catch(e){
        console.log(e)
    }

    let jr1 = undefined
    try{
        jr1 = await createJoinRequest(post1._id.toString(), user2._id.toString(), "I'd love to join this game!");
    }catch(e){
        console.log(e)
    }

    let rep1 = undefined
    try{
        rep1 = await createReport(user3._id.toString(), post2._id.toString(), "Why to death mountain, inappropriate location");
    }catch(e){
        console.log(e)
    }

    try{
        let followRes = await addFollower(user1._id.toString(), user2._id.toString())
    }catch(e){
        console.log(e)
    }
    try{
        let followRes2 = await addFollower(user1._id.toString(), user3._id.toString())
    }catch(e){
        console.log(e)
    }
    try{
        let followRes3 = await addFollower(user2._id.toString(), user3._id.toString())
    }catch(e){
        console.log(e)
    }

    try{
        let commentRes = await addComment(post1._id.toString(), user2._id.toString(), "Looking forward to this game!")
    }catch(e){
        console.log(e)
        console.log("Could not add comment")
    }
    try{
        let commentRes2 = await addComment(post1._id.toString(), user3._id.toString(), "Love the place!")
    }catch(e){
        console.log(e)
        console.log("Could not add comment 2")
    }

    console.log('Seeded database')
    await closeConnection()
}

main()