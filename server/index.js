const config = require('./config/config.json');
const { PubSub, GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const schema = require('./schema');
const services = require('./services');

mongoose.connect("mongodb+srv://chat_app:de6oblZ9IEkHXg8P@chat-app.qanii.mongodb.net/chat-app-db?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
});

const pubsub = new PubSub();
const server = new GraphQLServer({schema, services, context: {pubsub}});
mongoose.connection.once("open", () =>
	server.start(() => console.log("Listening at localhost:4000"))
);