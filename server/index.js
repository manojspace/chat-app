const { PubSub, GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const typeDefs = require('./schema');
const resolvers = require('./services');
const config = require('./config/config.json');

mongoose.connect(config.DB_URL, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
});

const pubsub = new PubSub();
const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});
mongoose.connection.once("open", () =>
	server.start(() => console.log("Listening at localhost:4000"))
);