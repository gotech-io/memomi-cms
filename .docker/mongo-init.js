db = db.getSiblingDB('template_db')

db.createUser({
  user: 'template_user',
  pwd: 'template_pass',
  roles: [
    {
      role: 'dbOwner',
      db: 'template_db',
    },
  ],
})

db.users.insertMany([
  {
    firstName: 'assaf',
    lastName: 'balzamovich',
    email: 'assaf@gotech.io',
    passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
  },
  {
    firstName: 'doron',
    lastName: 'feldman',
    email: 'doron@gotech.io',
    passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
  },
])
