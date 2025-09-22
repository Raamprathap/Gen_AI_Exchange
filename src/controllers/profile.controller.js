const { UserSchema } = require('../Schema/userSchema');
const connectDB = require('../config/connectDB');
const moment = require('moment-timezone');

const db = connectDB();

const PartialUserSchema = UserSchema.partial();

async function getUser(req, res) {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ success: false, error: 'email is required' });
		}

		const query = db.collection('users').where('email', '==', email).limit(1);
		const snap = await query.get();

		if (snap.empty) {
			return res.status(404).json({ success: false, error: 'User not found' });
		}

		const doc = snap.docs[0];
		return res.json({ success: true, data: { id: doc.id, ...doc.data() } });
	} catch (error) {
		console.error('getUser error:', error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

async function updateProfile(req, res) {
	try {
		// Accept email from body, query, or params for flexibility
		const email = (req.body && req.body.email) || (req.query && req.query.email) || (req.params && req.params.email);
		if (!email) {
			return res.status(400).json({ success: false, error: 'email is required' });
		}

		const parse = PartialUserSchema.safeParse(req.body);
		if (!parse.success) {
			return res.status(400).json({ success: false, error: 'Invalid payload', details: parse.error.flatten() });
		}

		const update = parse.data;
		// Do not allow changing primary email via this endpoint
		if (update && Object.prototype.hasOwnProperty.call(update, 'email') && update.email !== email) {
			return res.status(400).json({ success: false, error: 'email in payload must match lookup email' });
		}
		if (update && Object.prototype.hasOwnProperty.call(update, 'createdAt')) {
			delete update.createdAt;
		}

		update.updatedAt = moment().tz('Asia/Kolkata').toISOString();

		const query = db.collection('users').where('email', '==', email).limit(1);
		const snap = await query.get();
		if (snap.empty) {
			return res.status(404).json({ success: false, error: 'User not found' });
		}

		const doc = snap.docs[0];
		const docRef = doc.ref; // DocumentReference
		await docRef.set(update, { merge: true });

		const fresh = await docRef.get(); // DocumentSnapshot
		return res.json({ success: true, data: { id: fresh.id, ...fresh.data() } });
	} catch (error) {
		console.error('updateProfile error:', error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

module.exports = { getUser, updateProfile };
