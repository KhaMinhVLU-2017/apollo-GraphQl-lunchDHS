const { ApolloServer, gql } = require('apollo-server')
const {typeDefs, resolvers} = require('./schema')

var mongoose = require('mongoose')
mongoose.connect('mongodb://judasfate:lunchdhs2018@ds111192.mlab.com:11192/lunchdhs', { useNewUrlParser: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connect to DB')
})

const server = new ApolloServer({ typeDefs, resolvers, context: async ({req, connection}) =>{
  if (connection) {
    // check connection for metadata
    console.log('Subscription is listenning...!')
    return {}
  } else {
    // check from req
    const token = req.headers.authorization || "";

    return { token }
  }
}})

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});