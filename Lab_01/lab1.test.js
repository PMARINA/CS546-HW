

const lab1 = require('./lab1');

// Question 1 tests:

console.log(lab1.questionOne([2]));
// should return and output: {'3': true}

console.log(lab1.questionOne([2, 3, 4, 5]));
// should return and output: {  '3': true, '2': true, '9': true, '18': false }

console.log(lab1.questionOne([]));
// should return and output: {}

console.log(lab1.questionOne([10, 20, 30]));
// should return and output: { '93': false, '393': false, '893': false }

console.log(lab1.questionOne([-5, -10, -20]));
// should return and output: { '18': false, '93': false, '393': false }

// -----------------------------------------------------------------------------

// Question 2 tests:

console.log(lab1.questionTwo([1, 2, 3, 2, 1]));
// should return and output: [1, 2, 3]

console.log(lab1.questionTwo([1, '1', 2, '2', 2.0, 'car', 'zoom']));
// should return and output: [ 1, '1', 2, '2', 'car', 'zoom' ]

console.log(lab1.questionTwo(['1', '1', '1 ', 'abc', ' abc', 'ABC', ' ABC ']));
// should return and output: [ '1', '1 ', 'abc', ' abc', 'ABC', ' ABC ' ]

console.log(lab1.questionTwo([1.5, 2.5, 4.5, 1, 2, '1.5']));
// should return and output: [ 1.5, 2.5, 4.5, 1, 2, '1.5' ]

console.log(lab1.questionTwo(['test', '\'test', '\'test\'', 13]));
// should return and output: [ 'test', "'test", "'test'", 13 ]

// -----------------------------------------------------------------------------

// Question 3 tests:

console.log(lab1.questionThree(['bar', 'car', 'car', 'arc']));
// should return and output: { acr: ["car", "arc"] }

console.log(lab1.questionThree(['bard', 'beard', 'dad', 'add', 'ada', 'beer']));
// should return and output: { add: [ 'dad', 'add' ] }

console.log(lab1.questionThree(['not', 'a', 'fun', 'a', 'ton', 'nuff']));
// should return and output: { not: [ 'not', 'ton' ] }

console.log(lab1.questionThree(['ALPHA', 'alpha', 'AlPhA', 'Alphabet', 'bye']));
// should return and output: {}

console.log(lab1.questionThree(['agree', 'eager', 'eagre', 'ragee', 'ogre']));
// should return and output: { aeegr: [ 'agree', 'eager', 'eagre', 'ragee' ] }

// -----------------------------------------------------------------------------

// Question 4 tests:

console.log(lab1.questionFour(1, 3, 2));
// should return and output: 4

console.log(lab1.questionFour(1, 2, 3));
// should return and output: 4

console.log(lab1.questionFour(5, 6, 7));
// should return and output: 980

console.log(lab1.questionFour(2, 4, 6));
// should return and output 186

console.log(lab1.questionFour(1, 3, 4));
// should return and output 11
