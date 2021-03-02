import { firebaseDatabase } from '../config/firebase';

export default class FirebaseService {
	static getDataList = (nodePath, callback, size = 10) => {
		let query = firebaseDatabase.ref(nodePath).orderByChild('id').limitToLast(size);
		query.on('value', (dataSnapshot) => {
			let items = [];
			dataSnapshot.forEach((childSnapshot) => {
				let item = childSnapshot.val();
				item['key'] = childSnapshot.key;
				items.push(item);
			});
			callback(items);
		});

		return query;
	};

	static pushData = (node, objToSubmit) => {
		const ref = firebaseDatabase.ref(node).push();
		const id = firebaseDatabase.ref(node).push().key;
		ref.set(objToSubmit);
		return id;
	};

	static updateData = (id, node, objToSubmit) => {
		return firebaseDatabase.ref(`${node}/${id}`).update(objToSubmit);		
	};

	static remove = (id, node) => {
		return firebaseDatabase.ref(`${node}/${id}`).remove();
	};	
}
