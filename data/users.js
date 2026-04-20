//TODO functions to add, delete, ... from database

import {users} from "../config/mongoCollections.js"
import { checkAge, checkCity, checkEmail, checkFirstName, checkGender, checkLastName, 
    checkState, checkBio, checkPassword, checkVisibility, checkSportInterests, checkSkillLevel
} from "../helpers.js";
import bcrypt from 'bcrypt';

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

//Add more function if needed (updates, remove, etc...)