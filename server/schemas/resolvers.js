const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id })
            }
            throw new AuthenticationError('You need to be logged in!')
        }
    },

    Mutation: {
        addUser: async(parent, { username, email, password }) =>{
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { user, token }
        },
        login: async(parent, { email, password }) =>{
            const user = await User.findOne({ email })
            if (!user){
                throw new AuthenticationError('No user with this email')
            }

            const correctPw = await user.isCorrectPassword(password)

            if(!correctPw){
                throw new AuthenticationError('Your password is wrong')
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async(parent, { book }, context) =>{
            if(context.user) {
                const updateUserBooks = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book} },
                    { new: true },
                )
                return updateUserBooks;

            }
            throw new AuthenticationError('You need to be logged in!')

        },
        deleteBook: async (parent, { bookId }, context) =>{
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } }  },
                    { new: true },
                )
                return user
            }
            throw new AuthenticationError('You need to be logged in!')
        },
    }
}

module.exports = resolvers;