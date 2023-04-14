const express = require('express');
const { ApolloServer } = require('apollo-server-express')
const path = require('path');
//uncomment when you have built out these two files
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection');
const { __Directive } = require('graphql');
const { authMiddleware } = require('./utils/auth');
//no longer need this with the resolvers
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

//uncomment this when you have the files ready
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

//uncomment when you have the middleware built out 
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app })
  context: authMiddleware
}



// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  //allows you to use sandbox if need to test
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});

//uncomment when done with other work
startApolloServer(typeDefs, resolvers)
