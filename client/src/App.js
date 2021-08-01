import React, { useState, useEffect } from 'react';
import User from './users';
import Message from './messages';
import Registration from './login';
import { graphql } from 'react-apollo';
import {flowRight as compose} from 'lodash';
import {
	UserQuery,
	CreateUserMutation,
	DeleteUserMutation,
	AddUserSubscription,
	DeleteUserSubscription
} from './schema/user';

const App = props => {
	const user =
	(localStorage.getItem('token') &&
		JSON.parse(localStorage.getItem('token'))) ||
	{};

	const [receiverState, setReceiverState] = useState({
		receiverMail: '',
		receiverName: ''
	});

	const [userLeft, setUserLeft] = useState('');

	const [hidden, setHidden] = useState(false);

	const setSelectedMail = (mail, user) => {
		setReceiverState(receiverState => {
			return { ...receiverState, receiverMail: mail, receiverName: user };
		});
		setHidden(!hidden);
	};

	const setStyle = () => {
		setHidden(!hidden);
	};

	useEffect(() => {
		const subscribeToMore = props.data.subscribeToMore;
		subscribeToMore({
			document: AddUserSubscription,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const user = subscriptionData.data.newUser;
				if (!prev.users.find(x => x.id === user.id)) {
					return { ...prev, users: [...prev.users, user] };
				}
				return prev;
			}
		});
		subscribeToMore({
			document: DeleteUserSubscription,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const oldUser = subscriptionData.data.oldUser;
				if (prev.users.some(x => x.email === oldUser)) {
					const newUsers = prev.users.filter(x => x.email !== oldUser);
					prev.users = newUsers;
					return prev;
				}
				setUserLeft(oldUser);
				return prev;
			}
		});
	}, [props.data]);

	const createUser = async (email, name) => {
		return await props.createUser({
			variables: {
				email,
				name
			},
			update: (store, { data: { createUser } }) => {
				const data = store.readQuery({ query: UserQuery });
				if (!data.users.find(x => x.id === createUser.id)) {
					data.users.push(createUser);
				}
				store.writeQuery({ query: UserQuery, data });
			}
		});
	};

	const deleteUser = async email => {
		localStorage.removeItem('token');
		return await props.deleteUser({
			variables: { email },
			update: store => {
				const data = store.readQuery({ query: UserQuery });
				data.users = data.users.filter(x => x.email !== email);
				store.writeQuery({ query: UserQuery, data });
			}
		});
	};

	const { receiverMail, receiverName } = receiverState;
	const {
		data: { users, error, loading }
	} = props;

	if (loading || error) return null;
	if (localStorage.getItem('token')) {
		return (
			<div className="chat-page">
				<User
				style={{ display: hidden ? 'none' : 'block' }}
				users={users}
				email={user.email}
				name={user.name}
				selectedMail={setSelectedMail}
				deleteUser={deleteUser}
				/>
				<Message
				style={{ display: hidden ? 'block' : 'none' }}
				email={user.email}
				receiverMail={receiverMail}
				receiverName={receiverName}
				userLeft={userLeft}
				name={user.name}
				setStyle={setStyle}
				/>
			</div>
			);
	}
	return <Registration users={users} createUser={createUser} />;
};

export default compose(
	graphql(UserQuery),
	graphql(CreateUserMutation, { name: 'createUser' }),
	graphql(DeleteUserMutation, { name: 'deleteUser' })
)(App);
