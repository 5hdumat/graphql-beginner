import checkAuth from './checkAuth';
import { ADMIN } from '../../utils/constants';

const mutations = {
  async loginWithPassword(_, { email, pwd }) {
    if (!email || !pwd) throw 'Unauthorized'

    const authenticatingUser = await Meteor.users.findOne({ 'emails.address': email });

    if (!authenticatingUser) throw 'Unauthorized'
    if (!(authenticatingUser.services != null ? authenticatingUser.services.password : undefined)) throw 'Unauthorized'

    const passwordVerification = await Accounts._checkPassword(authenticatingUser, pwd)
    if (passwordVerification.error) throw 'Unauthorized'

    // 토큰 및 암호화 토큰 생성
    const authToken = Accounts._generateStampedLoginToken()
    const hashedToken = Accounts._hashLoginToken(authToken.token)

    // 암호화 된 토큰과 토큰 생성 날짜 저장
    Accounts._insertHashedLoginToken(authenticatingUser._id, { hashedToken, when: authToken.when })

    return { authToken, userId: authenticatingUser._id }
  },
  async logout(_, {}, { user, userToken }) {
    if (!user || !userToken) throw 'Not Login'

    try {
      const hashedToken = await Accounts._hashLoginToken(userToken);
      await Accounts.destroyToken(user._id, hashedToken)

      return true
    } catch (e) {
      throw e.message;
    }
  },
  async addUser(_, { email, pwd }, { user }) {
    const newUser = {
      email,
      password: pwd
    }

    try {
      const result = await Accounts.createUser(newUser);
      return result
    } catch (e) {
      throw e.message
    }
  },
  async updateUserRole(_, { _id, role }, { user }) {
    try {
      checkAuth(user, ADMIN)

      if (user.profile.role !== role) {
        const result = await Meteor.users.update(
          { _id: _id },
          { $set: { 'profile.role': role } }
        );

        return result
      }

      return false
    } catch (e) {
      throw `updateUserRole Error: ${error}`
    }
  }
}

const queries = {
  async users(_, args, { user }, info) {
    try {
      checkAuth(user, ADMIN)
      const result = await Meteor.users.find()
      return result
    } catch (e) {
      throw e;
    }
  },
  me(_, args, { user }, info) {
    let userValue = {
      _id: user._id,
      emails: [
        { address: user.emails[0].address }
      ],
      profile: {
        role: user.profile.role
      }
    }

    return userValue
  }
}

const resolvers = {
  Mutation: mutations,
  Query: queries
}

export default resolvers