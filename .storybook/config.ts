import { configure } from '@storybook/react';
import 'semantic-ui-css/semantic.min.css';
import 'typeface-pt-serif';

// automatically import all files ending in *.stories.tsx
const req = require.context('../client', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
