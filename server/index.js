const { PubSub, GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const typeDefs = require('./schema');
const resolvers = require('./services');
const config = require('./config/config.json');

mongoose.connect(config.DB_URL, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const pubsub = new PubSub();
const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});
const options = {
	port: 4000
}
mongoose.connection.once("open", () =>
	server.start(options, ({port}) => console.log(`Listening at localhost:${port}`))
);