import BEMHelper from 'react-bem-helper';

export const createBemHelper = (componentName: string) => {
  return new BEMHelper({
    prefix: 'flow-',
    name: componentName,
    outputIsString: true
  });
};
