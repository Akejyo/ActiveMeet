//TODO functions to add, delete, ... from database

import {users} from "../config/mongoCollections.js"
import { checkAge, checkCity, checkEmail, checkFirstName, checkGender, checkLastName, checkAuthorId,
    checkState, checkBio, checkPassword, checkVisibility, checkSportInterests, checkSkillLevel
} from "../helpers.js";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

export async function createUser(first, last, email, city, state, age, gender, bio, 
    sportsInterests, password, visibility, skill){
    first = checkFirstName(first)
    last = checkLastName(last)
    email = await checkEmail(email)
    city = checkCity(city)
    state = checkState(state)
    age = checkAge(age)
    gender = checkGender(gender)
    bio = checkBio(bio)
    sportsInterests = checkSportInterests(sportsInterests)
    password = checkPassword(password)
    visibility = checkVisibility(visibility)
    skill = checkSkillLevel(skill)
    let saltRounds = 15
    let pass = await bcrypt.hash(password, saltRounds)
    let newUser = {
        firstName: first,
        lastName: last,
        email: email,
        city: city,
        state: state,
        age: age,
        gender: gender,
        bio: bio,
        sportsInterests: sportsInterests,
        password: pass,
        followerIds: [],
        followingIds: [],
        createdPostIds: [],
        joinedPostIds: [],
        blockedUserIds: [],
        visibility: visibility,
        skill: skill
    }
    let users1 = await users()
    let iRes = await users1.insertOne(newUser)
    if (!iRes.acknowledged || !iRes.insertedId) throw 'Could not add user'
    let ret = await users1.findOne({_id: iRes.insertedId})
    return ret;
}

export async function addFollower(userId, followerId){
    userId = await checkAuthorId(userId)
    followerId = await checkAuthorId(followerId)
    let users1 = await users()
    let updateUser = await users1.updateOne({_id: new ObjectId(userId)}, {$addToSet: {followerIds: followerId}})
    if (!updateUser.acknowledged || updateUser.modifiedCount === 0) throw 'Could not add follower'
    let updateFollower = await users1.updateOne({_id: new ObjectId(followerId)}, {$addToSet: {followingIds: userId}})
    if (!updateFollower.acknowledged || updateFollower.modifiedCount === 0) throw 'Could not update follower'
    return true
}

//Add more function if needed (updates, remove, etc...)