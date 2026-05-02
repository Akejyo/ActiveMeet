//TODO functions to add, delete, ... from database

import {users} from "../config/mongoCollections.js"
import { checkAge, checkCity, checkEmail, checkFirstName, checkGender, checkLastName, checkAuthorId,
    checkState, checkBio, checkPassword, checkVisibility, checkSportInterests, checkSkillLevel, checkEmailFieldsOnly
} from "../helpers.js";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

export async function createUser(
  first,
  last,
  email,
  city,
  state,
  age,
  gender,
  bio,
  sportsInterests,
  password,
  visibility,
  skill,
) {
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
    skill: skill,
  }
  let users1 = await users()
  let iRes = await users1.insertOne(newUser)
  if (!iRes.acknowledged || !iRes.insertedId) throw 'Could not add user'
  let ret = await users1.findOne({ _id: iRes.insertedId })
  return ret
}

export async function getUser(userId) {
  userId = await checkAuthorId(userId)
  let users1 = await users()
  let user = await users1.findOne({ _id: new ObjectId(userId) })
  if (!user) throw 'User not found'
  return user
}

export async function updateUser(userId, updateData) {
  userId = await checkAuthorId(userId)
  if (
    !updateData ||
    typeof updateData !== 'object' ||
    Array.isArray(updateData)
  ) {
    throw 'Update data must be an object'
  }
  let user = await getUser(userId)
  let validFields = [
    'firstName',
    'lastName',
    'email',
    'city',
    'state',
    'age',
    'gender',
    'bio',
    'sportsInterests',
    'visibility',
    'skill',
  ]
  let isDataValid = Object.keys(updateData).every((key) =>
    validFields.includes(key),
  )
  if (!isDataValid) throw 'Update data contains invalid fields'
  for (let key in updateData) {
    if (key === 'firstName') updateData[key] = checkFirstName(updateData[key])
    else if (key === 'lastName')
      updateData[key] = checkLastName(updateData[key])
    else if (key === 'email')
      updateData[key] = await checkEmail(updateData[key])
    else if (key === 'city') updateData[key] = checkCity(updateData[key])
    else if (key === 'state') updateData[key] = checkState(updateData[key])
    else if (key === 'age') updateData[key] = checkAge(updateData[key])
    else if (key === 'gender') updateData[key] = checkGender(updateData[key])
    else if (key === 'bio') updateData[key] = checkBio(updateData[key])
    else if (key === 'sportsInterests')
      updateData[key] = checkSportInterests(updateData[key])
    else if (key === 'visibility')
      updateData[key] = checkVisibility(updateData[key])
    else if (key === 'skill') updateData[key] = checkSkillLevel(updateData[key])
  }
  let users1 = await users()
  let updateUser = await users1.FindOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updateData },
    { returnDocument: 'after' },
  )
  if (!updateUser) throw `Could not update user with id ${userId}`
  return updateUser
}

export async function deleteUser(userId) {
  userId = await checkAuthorId(userId)
  let users1 = await users()
  let deleteUser = await users1.findOneAndDelete({ _id: new ObjectId(userId) })
  if (!deleteUser) throw `Could not delete user with id ${userId}`
  return { deleted: true }
}

export async function addFollower(userId, followerId) {
  userId = await checkAuthorId(userId)
  followerId = await checkAuthorId(followerId)
  let users1 = await users()
  let updateUser = await users1.updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { followerIds: followerId } },
  )
  if (!updateUser.acknowledged || updateUser.modifiedCount === 0)
    throw 'Could not add follower'
  let updateFollower = await users1.updateOne(
    { _id: new ObjectId(followerId) },
    { $addToSet: { followingIds: userId } },
  )
  if (!updateFollower.acknowledged || updateFollower.modifiedCount === 0)
    throw 'Could not update follower'
  return true
}

export async function removeFollower(userId, followerId) {
  userId = await checkAuthorId(userId)
  followerId = await checkAuthorId(followerId)
  let users1 = await users()
  let updateUser = await users1.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { followerIds: followerId } },
  )
  if (updateUser.modifiedCount === 0) throw 'Could not remove follower'
  let updateFollower = await users1.updateOne(
    { _id: new ObjectId(followerId) },
    { $pull: { followingIds: userId } },
  )
  if (updateFollower.modifiedCount === 0) throw 'Could not update follower'
  return true
}

export async function authenticateUser(email, password){
    email = checkEmailFieldsOnly(email)
    password = checkPassword(password)
    let users1 = await users()
    let user = await users1.findOne({email: email})
    if (!user) throw 'Either email or password is incorrect'
    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw 'Either email or password is incorrect'
    return user
}


export async function editSportInterests(userId, sportsInterests){
    userId = await checkAuthorId(userId)
    sportsInterests = checkSportInterests(sportsInterests)
    let users1 = await users()
    let updateUser = await users1.updateOne({_id: new ObjectId(userId)}, {$set: {sportsInterests: sportsInterests}})
    if (!updateUser.acknowledged) throw 'Could not update sport interests'
    return true
}
//Add more function if needed (updates, remove, etc...)
