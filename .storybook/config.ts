import { configure } from '@storybook/react';
// import { setDefaults } from 'react-storybook-addon-props-combinations';
// import 'typeface-open-sans';
// import '~/index.scss';

// import './storybook.scss';

// automatically import all files ending in *.stories.tsx
const req = require.context('../client', true, /\.stories\.tsx$/);

// setDefaults({
//   // overwrite global defaults here
// });

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
