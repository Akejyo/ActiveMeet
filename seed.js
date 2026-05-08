import { dbConnection, closeConnection } from './config/mongoConnection.js'
import { createUser, addFollower } from './data/users.js'
import { createPost, addComment, likePost, dislikePost } from './data/posts.js'
import { createJoinRequest } from './data/joinRequests.js'
import { createReport2 } from './data/reports.js'

const main = async () => {
  const db = await dbConnection()
  await db.dropDatabase()
  let user1,
    user2,
    user3 = undefined
  try {
    user1 = await createUser(
      'Ismael',
      'Davila',
      'ismdav@example.com',
      'New York',
      'NY',
      30,
      'Male',
      'I love playing basketball!',
      ['Basketball'],
      'Password1!',
      'public',
      'intermediate'
    )
  } catch (e) {
    console.log(e)
  }
  try {
    user2 = await createUser(
      'Neville',
      'Longbottom',
      'nev@gmail.com',
      'Jacksonville',
      'FL',
      25,
      'Male',
      "Don't know what to write here",
      ['Hockey', 'Soccer'],
      'Password2!',
      'private',
      'beginner'
    )
  } catch (e) {
    console.log(e)
  }
  try {
    user3 = await createUser(
      'Pablo',
      'Doe',
      'pab@example.com',
      'Los Angeles',
      'CA',
      35,
      'Male',
      'I am a machine!',
      ['Running', 'Basketball'],
      'Password3!',
      'public',
      'advanced'
    )
  } catch (e) {
    console.log(e)
  }

  let user4,
    user5,
    user6,
    user7,
    user8 = undefined

  try {
    user4 = await createUser(
      'Maya',
      'Chen',
      'maya@example.com',
      'Hoboken',
      'NJ',
      22,
      'Female',
      'I enjoy tennis and running with local groups.',
      ['Tennis', 'Running', 'Gym'],
      'Password4!',
      'public',
      'intermediate'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    user5 = await createUser(
      'Sophia',
      'Martinez',
      'sophia@example.com',
      'Jersey City',
      'NJ',
      28,
      'Female',
      'Weekend volleyball player and casual hiker.',
      ['Volleyball', 'Hiking', 'Soccer'],
      'Password5!',
      'public',
      'beginner'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    user6 = await createUser(
      'Ethan',
      'Brooks',
      'ethan@example.com',
      'Brooklyn',
      'NY',
      31,
      'Male',
      'Looking for pickup games and friendly competition.',
      ['Football', 'Basketball', 'Gym'],
      'Password6!',
      'private',
      'advanced'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    user7 = await createUser(
      'Olivia',
      'Reed',
      'olivia@example.com',
      'Newark',
      'NJ',
      24,
      'Female',
      'I like swimming cycling and group fitness events.',
      ['Swimming', 'Cycling', 'Gym'],
      'Password7!',
      'public',
      'intermediate'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    user8 = await createUser(
      'Daniel',
      'Kim',
      'daniel@example.com',
      'Queens',
      'NY',
      27,
      'Male',
      'I play baseball bowling and tennis after work.',
      ['Baseball', 'Bowling', 'Tennis'],
      'Password8!',
      'public',
      'beginner'
    )
  } catch (e) {
    console.log(e)
  }

  let post1,
    post2,
    post3 = undefined
  try {
    let dandT = new Date('2026-05-25T07:00:00Z')
    post1 = await createPost(
      'Basketball Game',
      user1._id.toString(),
      'Basketball',
      'Looking for players to join a friendly basketball game this weekend!',
      dandT,
      10,
      { min: 18, max: 120 },
      'intermediate',
      'co-ed',
      'Central Park'
    )
  } catch (e) {
    console.log(e)
  }
  try {
    let dandT2 = new Date('2026-05-20T15:00:00Z')
    post2 = await createPost(
      'Hiking Trip',
      user2._id.toString(),
      'Hiking',
      'Join us for a fun hiking trip in the mountains!',
      dandT2,
      5,
      { min: 23, max: 50 },
      'beginner',
      'co-ed',
      'Death Mountain'
    )
  } catch (e) {
    console.log(e)
  }
  try {
    let dandT3 = new Date('2026-06-15T10:00:00Z')
    post3 = await createPost(
      'Running Group',
      user3._id.toString(),
      'Running',
      'Join our weekly running group!',
      dandT3,
      8,
      { min: 25, max: 80 },
      'advanced',
      'co-ed',
      'Hoboken Waterfront'
    )
  } catch (e) {
    console.log(e)
  }

  let post4,
    post5,
    post6,
    post7,
    post8,
    post9,
    post10 = undefined

  try {
    let dandT4 = new Date('2026-06-20T18:00:00Z')
    post4 = await createPost(
      'Tennis Rally',
      user4._id.toString(),
      'Tennis',
      'Looking for someone to rally and play casual sets.',
      dandT4,
      4,
      { min: 18, max: 45 },
      'intermediate',
      'co-ed',
      'Hoboken Courts'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    let dandT5 = new Date('2026-06-22T19:00:00Z')
    post5 = await createPost(
      'Volley Night',
      user5._id.toString(),
      'Volleyball',
      'Casual volleyball night for beginners and friendly players.',
      dandT5,
      12,
      { min: 18, max: 60 },
      'beginner',
      'co-ed',
      'Pier A Park'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    let dandT6 = new Date('2026-06-25T17:30:00Z')
    post6 = await createPost(
      'Football Drills',
      user6._id.toString(),
      'Football',
      'Running drills and small scrimmages for experienced players.',
      dandT6,
      14,
      { min: 18, max: 40 },
      'advanced',
      'male only',
      'Liberty Field'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    let dandT7 = new Date('2026-07-02T16:00:00Z')
    post7 = await createPost(
      'Soccer Match',
      user2._id.toString(),
      'Soccer',
      'Friendly soccer match with mixed skill levels welcome.',
      dandT7,
      16,
      { min: 18, max: 50 },
      'all levels',
      'co-ed',
      'Stevens Field'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    let dandT8 = new Date('2026-07-05T12:00:00Z')
    post8 = await createPost(
      'Gym Session',
      user3._id.toString(),
      'Gym',
      'Group workout focused on strength and conditioning.',
      dandT8,
      6,
      { min: 18, max: 45 },
      'intermediate',
      'co-ed',
      'Campus Gym'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    let dandT9 = new Date('2026-07-12T09:30:00Z')
    post9 = await createPost(
      'Swim Practice',
      user7._id.toString(),
      'Swimming',
      'Lap swim practice for people building endurance.',
      dandT9,
      8,
      { min: 18, max: 55 },
      'intermediate',
      'co-ed',
      'Newark Pool'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    let dandT10 = new Date('2026-07-18T20:00:00Z')
    post10 = await createPost(
      'Bowling Night',
      user8._id.toString(),
      'Bowling',
      'Casual bowling night for anyone looking to relax.',
      dandT10,
      10,
      { min: 18, max: 70 },
      'all levels',
      'co-ed',
      'Queens Lanes'
    )
  } catch (e) {
    console.log(e)
  }

  let jr1 = undefined
  try {
    jr1 = await createJoinRequest(
      post1._id.toString(),
      user2._id.toString(),
      "I'd love to join this game!"
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createJoinRequest(
      post4._id.toString(),
      user1._id.toString(),
      'I can join for singles or doubles.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createJoinRequest(
      post5._id.toString(),
      user4._id.toString(),
      'I am new to volleyball but would like to play.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createJoinRequest(
      post7._id.toString(),
      user5._id.toString(),
      'I would like to join the soccer match.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createJoinRequest(
      post8._id.toString(),
      user6._id.toString(),
      'I can join the gym session.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createJoinRequest(
      post9._id.toString(),
      user3._id.toString(),
      'I want to work on endurance.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createJoinRequest(
      post10._id.toString(),
      user5._id.toString(),
      'Bowling sounds fun.'
    )
  } catch (e) {
    console.log(e)
  }

  let rep1 = undefined
  try {
    rep1 = await createReport2(
      user3._id.toString(),
      'post',
      user1.email,
      'Inappropriate content',
      'His post on basketball is inappropriate.'
    )
    // rep1 = await createReport(user3._id.toString(), post2._id.toString(), "Why to death mountain, inappropriate location");
  } catch (e) {
    console.log(e)
  }

  try {
    await createReport2(
      user2._id.toString(),
      'user',
      user6.email,
      'Harassment',
      'The user sent an unfriendly message about joining a game.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createReport2(
      user5._id.toString(),
      'post',
      user3.email,
      'Spam',
      'The post seems repetitive and not very helpful.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createReport2(
      user4._id.toString(),
      'post',
      user2.email,
      'Fake Event',
      'The event location and details seem questionable.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await createReport2(
      user1._id.toString(),
      'user',
      user6.email,
      'Other',
      'The profile behavior made me uncomfortable.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    let followRes = await addFollower(
      user1._id.toString(),
      user2._id.toString()
    )
  } catch (e) {
    console.log(e)
  }
  try {
    let followRes2 = await addFollower(
      user1._id.toString(),
      user3._id.toString()
    )
  } catch (e) {
    console.log(e)
  }
  try {
    let followRes3 = await addFollower(
      user2._id.toString(),
      user3._id.toString()
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await addFollower(user3._id.toString(), user4._id.toString())
  } catch (e) {
    console.log(e)
  }

  try {
    await addFollower(user4._id.toString(), user1._id.toString())
  } catch (e) {
    console.log(e)
  }

  try {
    await addFollower(user5._id.toString(), user2._id.toString())
  } catch (e) {
    console.log(e)
  }

  try {
    await addFollower(user6._id.toString(), user1._id.toString())
  } catch (e) {
    console.log(e)
  }

  try {
    await addFollower(user6._id.toString(), user5._id.toString())
  } catch (e) {
    console.log(e)
  }

  try {
    await addFollower(user7._id.toString(), user4._id.toString())
  } catch (e) {
    console.log(e)
  }

  try {
    await addFollower(user8._id.toString(), user5._id.toString())
  } catch (e) {
    console.log(e)
  }

  try {
    let commentRes = await addComment(
      post1._id.toString(),
      user2._id.toString(),
      'Looking forward to this game!'
    )
  } catch (e) {
    console.log(e)
    console.log('Could not add comment')
  }
  try {
    let commentRes2 = await addComment(
      post1._id.toString(),
      user3._id.toString(),
      'Love the place!'
    )
  } catch (e) {
    console.log(e)
    console.log('Could not add comment 2')
  }

  try {
    await addComment(
      post2._id.toString(),
      user1._id.toString(),
      'This hike sounds like a great weekend plan.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await addComment(
      post3._id.toString(),
      user4._id.toString(),
      'I am interested in joining this running group.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await addComment(
      post4._id.toString(),
      user5._id.toString(),
      'I have been looking for tennis partners nearby.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await addComment(
      post5._id.toString(),
      user6._id.toString(),
      'This sounds like a fun casual volleyball event.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await addComment(
      post7._id.toString(),
      user1._id.toString(),
      'I can bring an extra ball for the match.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await addComment(
      post9._id.toString(),
      user8._id.toString(),
      'I want to improve my swimming form.'
    )
  } catch (e) {
    console.log(e)
  }

  try {
    await addComment(
      post10._id.toString(),
      user7._id.toString(),
      'I have not gone bowling in a while.'
    )
  } catch (e) {
    console.log(e)
  }

  // Likes
  try {
    await likePost(post1._id.toString(), user4._id.toString())
    await likePost(post1._id.toString(), user5._id.toString())
    await likePost(post2._id.toString(), user1._id.toString())
    await likePost(post3._id.toString(), user2._id.toString())
    await likePost(post4._id.toString(), user1._id.toString())
    await likePost(post5._id.toString(), user3._id.toString())
    await likePost(post7._id.toString(), user4._id.toString())
    await likePost(post8._id.toString(), user7._id.toString())
    await likePost(post9._id.toString(), user8._id.toString())
    await likePost(post10._id.toString(), user1._id.toString())
  } catch (e) {
    console.log(e)
    console.log('Could not add likes')
  }

  // Dislikes
  try {
    await dislikePost(post6._id.toString(), user2._id.toString())
    await dislikePost(post8._id.toString(), user5._id.toString())
    await dislikePost(post10._id.toString(), user3._id.toString())
  } catch (e) {
    console.log(e)
    console.log('Could not add dislikes')
  }

  /* placeholder for testing blocking function when implemented
  try {
    const usersCollection = await users()
    await usersCollection.updateOne(
      { _id: new ObjectId(user1._id.toString()) },
      { $addToSet: { blockedUserIds: user6._id.toString() } }
    )
  } catch (e) {
    console.log(e)
    console.log('Could not add blocked user seed data')
  } */

  console.log('Seeded database')
  await closeConnection()
}

main()
