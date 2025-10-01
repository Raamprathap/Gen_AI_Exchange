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
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ success: false, error: 'email is required' });
		}

		const parse = PartialUserSchema.safeParse(req.body);
		if (!parse.success) {
			return res.status(400).json({ success: false, error: 'Invalid payload', details: parse.error.flatten() });
		}

		const update = parse.data;
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
		const docRef = doc.ref;
		await docRef.set(update, { merge: true });

		const fresh = await docRef.get();
		return res.json({ success: true, data: { id: fresh.id, ...fresh.data() } });
	} catch (error) {
		console.error('updateProfile error:', error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

async function getDashboardData(req, res) {
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
		const userData = doc.data();

		const skillsMastered = userData.skills?.filter(skill => skill.level >= 80).length || 0;
		const profileCompleteness = calculateProfileCompleteness(userData);
		const careerScore = Math.min(100, Math.round((skillsMastered * 10) + (profileCompleteness * 0.5) + (userData.experience?.length * 5 || 0)));

		const dashboardData = {
			skillsMastered,
			careerScore,
			coursesCompleted: userData.dashboardData?.coursesCompleted || 8,
			certifications: userData.dashboardData?.certifications || 3,
			profileCompleteness,
			recentActivities: userData.dashboardData?.recentActivities || [
				{ action: "Updated", item: "Profile Skills", time: "1 hour ago", type: "skill" },
				{ action: "Completed", item: "JavaScript Assessment", time: "3 hours ago", type: "course" },
				{ action: "Started", item: userData.title ? `${userData.title} Roadmap` : "Development Path", time: "1 day ago", type: "roadmap" }
			],
			upcomingMilestones: userData.dashboardData?.upcomingMilestones || generatePersonalizedMilestones(userData),
			recommendations: userData.dashboardData?.recommendations || generatePersonalizedRecommendations(userData),
			skillProgress: userData.skills?.map(skill => ({
				name: skill.name,
				level: skill.level,
				target: Math.min(100, skill.level + 15)
			})) || []
		};

		return res.json({ success: true, data: dashboardData });
	} catch (error) {
		console.error('getDashboardData error:', error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

function calculateProfileCompleteness(userData) {
	let completeness = 0;
	const fields = [
		userData.name, userData.email, userData.phone, userData.location,
		userData.title, userData.company, userData.bio
	];
	
	fields.forEach(field => {
		if (field && field.trim()) completeness += 10;
	});

	if (userData.skills && userData.skills.length > 0) completeness += 15;
	if (userData.experience && userData.experience.length > 0) completeness += 15;
	if (userData.education && userData.education.length > 0) completeness += 10;
	if (userData.social && (userData.social.github || userData.social.linkedin)) completeness += 10;

	return Math.min(100, completeness);
}

function generatePersonalizedMilestones(userData) {
	const milestones = [];
	const userSkills = userData.skills || [];
	const userTitle = userData.title || "Developer";

	if (userSkills.some(s => s.name.toLowerCase().includes('react') && s.level < 80)) {
		milestones.push({
			title: "Master React Advanced Concepts",
			deadline: "2 weeks",
			progress: userSkills.find(s => s.name.toLowerCase().includes('react'))?.level || 60,
			priority: "high",
			category: "skill"
		});
	}

	if (userSkills.some(s => s.name.toLowerCase().includes('javascript') && s.level < 90)) {
		milestones.push({
			title: "Complete JavaScript ES6+ Mastery",
			deadline: "3 weeks",
			progress: userSkills.find(s => s.name.toLowerCase().includes('javascript'))?.level || 70,
			priority: "medium",
			category: "skill"
		});
	}

	milestones.push({
		title: `${userTitle} Portfolio Project`,
		deadline: "6 weeks",
		progress: 20,
		priority: "high",
		category: "project"
	});

	return milestones.slice(0, 3);
}

function generatePersonalizedRecommendations(userData) {
	const recommendations = [];
	const userSkills = userData.skills || [];
	const userTitle = userData.title || "Developer";

	if (userSkills.some(s => s.name.toLowerCase().includes('react'))) {
		recommendations.push({
			type: "course",
			title: "Advanced React Patterns & Best Practices",
			provider: "Tech Academy",
			duration: "4 weeks",
			rating: 4.8,
			relevance: 95,
			url: "#"
		});
	}

	if (userSkills.some(s => s.name.toLowerCase().includes('javascript'))) {
		recommendations.push({
			type: "certification",
			title: "JavaScript Professional Certification",
			provider: "Developer Institute",
			duration: "6 weeks",
			rating: 4.9,
			relevance: 90,
			url: "#"
		});
	}

	recommendations.push({
		type: "job",
		title: `Senior ${userTitle} Position`,
		provider: "TechCorp",
		duration: "Full-time",
		rating: 4.5,
		relevance: 88,
		url: "#"
	});

	return recommendations.slice(0, 3);
}

module.exports = { getUser, updateProfile, getDashboardData };
