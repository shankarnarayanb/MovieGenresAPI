const express = require('express');
const Joi = require('joi');
const { resourceLimits } = require('worker_threads');
const app = express();
app.use(express.json());

let genres = [
	{ id: 1, name: 'Action' },
	{ id: 2, name: 'Comedy' },
	{ id: 3, name: 'Drama' },
	{ id: 4, name: 'Fantasy' },
	{ id: 5, name: 'Horror' },
	{ id: 6, name: 'Mystery' },
	{ id: 7, name: 'Romance' },
	{ id: 8, name: 'Thriller' },
	{ id: 9, name: 'Western' }
];

let checkExistenceOfAGenre = (id) => {
	let genre = genres.find((c) => c.id === parseInt(id));
	if (!genre) {
		return '{"Error" : "genre not found."}';
	} else {
		return true;
	}
};

let validateSchema = (req, category) => {
	let schema;
	if (category === 'name') {
		schema = Joi.object({
			name: Joi.string().min(3).max(30).required()
		});
	} else if (category === 'id') {
		schema = Joi.object({
			id: Joi.number().min(1).required()
		});
	} else {
		schema = Joi.object({
			id: Joi.number().min(1).required(),
			name: Joi.string().min(3).max(30).required()
		});
	}
	if (req) {
		if (category === 'id') {
			return schema.validate(req.params);
		}
		return schema.validate(req.body);
	}
};

let checkError = (error) => {
	if (error) {
		return res.status(400).send(error.details);
	}
};

app.get('/', (req, res) => {
	res.send({ message: 'This API provides a list of basic film genres. Call the API on the end point /api/genres' });
});

app.get('/api/reset', (req, res) => {
	genres = [];
	genres = [
		{ id: 1, name: 'Action' },
		{ id: 2, name: 'Comedy' },
		{ id: 3, name: 'Drama' },
		{ id: 4, name: 'Fantasy' },
		{ id: 5, name: 'Horror' },
		{ id: 6, name: 'Mystery' },
		{ id: 7, name: 'Romance' },
		{ id: 8, name: 'Thriller' },
		{ id: 9, name: 'Western' }
	]
	res.send({ message: 'API data reset' });
});

app.get('/api/genres/', (req, res) => {
	res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
	let result = checkExistenceOfAGenre(req.params.id, res);
	if (result !== true) {
		return res.status(404).send(result);
	}

	return res.send(genres[genres.findIndex((el) => el.id === parseInt(req.params.id))]);
});

app.get('/api/posts/:year/:month', (req, res) => {
	res.send(req.params);
});

app.post('/api/genres/', (req, res) => {
	const { error, value } = validateSchema(req, 'name');
	checkError(error);

	const genre = {
		id: genres.length + 1,
		name: req.body.name
	};
	genres.push(genre);
	return res.status(201).send(genre);
});

app.put('/api/genres/:id', (req, res) => {
	let result = checkExistenceOfAGenre(req.params.id, res);
	if (result !== true) {
		return res.status(404).send(result);
	}
	const { error, value } = validateSchema(req, 'name');
	checkError(error);

	const genre = {
		id: parseInt(req.params.id),
		name: req.body.name
	};
	genres[genres.findIndex((el) => el.id === parseInt(req.params.id))] = genre;
	res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
	let result = checkExistenceOfAGenre(req.params.id, res);
	if (result !== true) {
		return res.status(404).send(result);
	}

	let genre = genres.find((c) => c.id === parseInt(req.params.id));
	if (!genre) {
		return res.status(404).send('genre not found.');
	}

	genres.splice(genres.findIndex((el) => el.id === genre.id));
	return res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
