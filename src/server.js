import fastify from 'fastify';
import view from '@fastify/view';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { getData } from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

app.register(view, {
    engine: { handlebars },
    root: path.join(__dirname, '../templates'),
    layout: 'index.hbs',
    options: {
        partials: {
            header: 'header.hbs',
            footer: 'footer.hbs',
        },
    },
});

app.get('/', async (request, reply) => {
    const url = 'https://gateway.marvel.com/v1/public/characters';
    const characters = await getData(url);
    return reply.view('index.hbs', { characters });
});

const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('🚀 Serveur démarré sur http://localhost:3000');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
