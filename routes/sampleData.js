export const samplePosts = [
  {
    id: 1,
    sport: 'Basketball',
    title: 'Need 3 more players for a 5v5 game',
    author: 'Jordan Lee',
    location: 'Brooklyn Bridge Park',
    date: '2026-04-20',
    time: '18:30',
    skill: 'Intermediate',
    ageRange: '18-30',
    gender: 'Co-ed',
    description:
      'Friendly full-court game this Saturday evening. Bring water and be ready to play hard.',
    likes: 24,
    comments: 6
  },
  {
    id: 2,
    sport: 'Hiking',
    title: 'Sunday morning trail hike',
    author: 'Emma Stone',
    location: 'Bear Mountain',
    date: '2026-04-21',
    time: '08:00',
    skill: 'Beginner',
    ageRange: 'All ages',
    gender: 'Co-ed',
    description:
      'Casual hike with great views. Perfect for beginners who want to meet new people.',
    likes: 17,
    comments: 4
  },
  {
    id: 3,
    sport: 'Running',
    title: '5K training group in Central Park',
    author: 'Chris Wong',
    location: 'Central Park',
    date: '2026-04-22',
    time: '07:00',
    skill: 'All levels',
    ageRange: '18+',
    gender: 'Co-ed',
    description:
      'Morning 5K pace run and stretching session. Great if you are preparing for a local race.',
    likes: 31,
    comments: 10
  }
];

export const sampleUser = {
  // name: 'Alex Carter',
  // username: '@alexfit', //Not username but email
  firstName: 'Alex',
  lastName: 'Carter',
  city: 'New York',
  state: 'NY',
  age: 22,
  gender: 'Male',
  skill: 'Intermediate',
  bio: 'Basketball lover, weekend runner, always looking for active people to join local games.',
  interests: ['Basketball', 'Running', 'Hiking', 'Gym'],
  followers: 128,
  following: 76,
  badges: ['Rising Player', 'Community Helper', 'Weekend Warrior']
};

export const followingList = [
  { name: 'Emma Stone', sport: 'Hiking', status: 'Following' },
  { name: 'Chris Wong', sport: 'Running', status: 'Following' },
  { name: 'Jordan Lee', sport: 'Basketball', status: 'Following' }
];

export const comments = [
  { user: 'Mia', content: 'Sounds fun, is there still space left?' },
  { user: 'Noah', content: 'I can join. I usually play point guard.' },
  { user: 'Sophia', content: 'What court are you using exactly?' }
];
