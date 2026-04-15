import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    helpers: {
      eq: (a, b) => a === b
    }
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});