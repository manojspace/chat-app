import React, {useState} from 'react';
import {LockOutlined} from '@material-ui/icons';
import {Container, Typography, Box, Link, TextField, CssBaseline, Button, Avatar, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import validator from "validator";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="manojspace.com">
				manojspace.com
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
		);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginLeft: '15px',
		marginRight: '15px'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	error: {
		color: 'red'
	}
}));

export default function SignIn(props) {
	const classes = useStyles();
	const [token, setToken] = useState({ name: "", email: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = e => {
		setToken({ ...token, [e.target.name]: e.target.value });
	};

	const validate = async () => {
		const { name, email } = token;

		const existingUser = props.users.some(function(user) {
			return user.email === email;
		});

		if (!name.length) {
			setError("Name is required");
		}

		if (!validator.isEmail(email)) {
			setError("Valid email is required");
		}

		if (existingUser) {
			setError("Email already in use");
		}

		if (name.length && validator.isEmail(email) && !existingUser) {
			setLoading(true);
			setError("");
			await props.createUser(email, name);
			setLoading(false);
			localStorage["token"] = JSON.stringify(token);
			window.location.href = window.location.href;
		}
	};

	const { name, email } = token;

	return (
		<Container component="main" maxWidth="xs" style={{marginBottom: '20px'}}>
			<Paper>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlined />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="name"
					label="Name"
					name="name"
					size="small"
					autoFocus
					value={name}
					onChange={handleChange}
					error={(!name && error)?true:false}
					helperText={(!name && error)?"Please enter your name to enter into chat":null}
					/>
					<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="email"
					label="Email"
					type="email"
					id="email"
					size="small"
					value={email}
					onChange={handleChange}
					error={(!email && error)?true:false}
					helperText={(!email && error)?"Please enter email address to enter into chat":null}
					/>
					<Button
					type="button"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
					disabled={loading}
					onClick={validate}
					>
						{loading?"Please wait...":"Submit"}
					</Button>
					<div style={{color: 'red'}}>{error}</div>
				</form>
			</div>
			<Box mt={8}>
				<Copyright />
			</Box>
			</Paper>
		</Container>
		);
}