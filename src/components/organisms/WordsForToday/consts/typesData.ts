import trainingTypes from './trainingTypes';

const typesData = {
  [trainingTypes.Words]: {
    title: '📜 Select right translation',
    definition: 'You will have to choose one of the four translation options.',
  },
  [trainingTypes.Sentences]: {
    title: '🎓 Insert the appropriate word',
    definition:
      'You will have to insert the appropriate word in the sentence, choosing from four options.',
  },
};

export default typesData;
