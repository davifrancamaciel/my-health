import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from 'store/modules/auth/actions';

function SignOut() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(signOut());
	}, []);
	return <div />;
}

export default SignOut;
