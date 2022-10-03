Meteor.setTimeout(() => {
  const userCount = Meteor.users.find().count()

  if (userCount === 0) {
    const userValues = {
      email: 'admin@admin.com',
      password: '1234'
    }

    Accounts.createUser(userValues);
  } else{
    consele.log(`userCount: ${userCount}`)
  }
}, 3000)