import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppServerModule } from './src/main.server';

const app = express();

const distFolder = join(process.cwd(), 'dist/user-app/browser');
const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));
app.set('view engine', 'html');
app.set('views', distFolder);

// Expose static files
app.get('*.*', express.static(distFolder, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(indexHtml, { req }); // ✅ pas "index.html"
});

// Start the server
const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`✅ SSR running on http://localhost:${port}`);
});
