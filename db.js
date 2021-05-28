const Pool = require("pg").Pool;
const pool = new Pool({
	user: "wtlijjbmmgepbr",
	password: "30f84d7c05f774110a3df4a17af996126797a4b173a820e900fcbea6c7026558",
	host: "ec2-34-202-54-225.compute-1.amazonaws.com",
	port: 5432,
	database: "d5qcbcgmrtdev9",
	ssl:{
		rejectUnauthorized: false
	}
});

module.exports = pool;
