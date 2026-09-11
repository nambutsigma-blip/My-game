import { UnitData, ReviewQuestion } from '../types';
import { MILESTONE_1_UNITS } from './units/milestone1';
import { MILESTONE_2_UNITS } from './units/milestone2';
import { MILESTONE_3_UNITS } from './units/milestone3';
import { MILESTONE_4_UNITS } from './units/milestone4';

export const UNITS_DATA: UnitData[] = [
  ...MILESTONE_1_UNITS,
  ...MILESTONE_2_UNITS,
  ...MILESTONE_3_UNITS,
  ...MILESTONE_4_UNITS,
];

// Chặng 4: Review Checkpoint questions (Units 1-3 Dragon Escape Chase - 20 questions)
// 60% Units 1-3 content + 40% Grade 8 Foundation
export const REVIEW_QUESTIONS_UNITS_1_3: ReviewQuestion[] = [
  {
    id: 'rq-1',
    question: 'My father is keen _______ playing chess with his old neighbor every Sunday afternoon.',
    options: ['on', 'in', 'at', 'with'],
    correctIndex: 0,
    explanation: 'The fixed preposition collocation is "keen on" = passionate about something.',
    unitOrigin: 'Unit 1: Leisure Time',
  },
  {
    id: 'rq-2',
    question: 'Lan adores _______ handmade greeting cards for her teachers on special occasions.',
    options: ['crafting', 'craft', 'to crafting', 'crafted'],
    correctIndex: 0,
    explanation: 'Verbs of liking such as "adore" are followed by a Gerund (V-ing): adore crafting.',
    unitOrigin: 'Unit 1: Leisure Time',
  },
  {
    id: 'rq-3',
    question: 'A tractor can plow fields much _______ than a water buffalo.',
    options: ['more quickly', 'quicker', 'quicklier', 'as quick'],
    correctIndex: 0,
    explanation: 'Adverbs ending in -ly use "more + adverb" for comparative form: more quickly.',
    unitOrigin: 'Unit 2: Countryside',
  },
  {
    id: 'rq-4',
    question: 'In the harvest season, country farmers work _______ than usual.',
    options: ['harder', 'more hard', 'hardlier', 'more hardly'],
    correctIndex: 0,
    explanation: 'The adverb "hard" is irregular and takes the short form: hard -> harder.',
    unitOrigin: 'Unit 2: Countryside',
  },
  {
    id: 'rq-5',
    question: '_______ it rained heavily yesterday, the football match was not cancelled.',
    options: ['Although', 'Because', 'So', 'However'],
    correctIndex: 0,
    explanation: 'Concession clause: "Although it rained heavily, the football match was not cancelled."',
    unitOrigin: 'Unit 3: Teenagers',
  },
  {
    id: 'rq-6',
    question: 'Tom felt extremely stressed before the final exams, _______ he talked to the counselor.',
    options: ['so', 'because', 'although', 'but'],
    correctIndex: 0,
    explanation: '"so" connects a cause to its result: he felt stressed, so he talked to the counselor.',
    unitOrigin: 'Unit 3: Teenagers',
  },
  {
    id: 'rq-7',
    question: 'Choose the word whose underlined part is pronounced differently: /f/',
    options: ['laugh', 'rough', 'photograph', 'plough'],
    correctIndex: 3,
    explanation: '"plough" has a silent "gh" (/plaʊ/), whereas the other three words are pronounced with /f/.',
    unitOrigin: 'Grade 8 Pronunciation',
  },
  {
    id: 'rq-8',
    question: 'She detests _______ up early on freezing winter mornings.',
    options: ['waking', 'wake', 'to wake', 'woke'],
    correctIndex: 0,
    explanation: 'The verb "detest" takes a Gerund (V-ing): detests waking up.',
    unitOrigin: 'Unit 1: Leisure Time',
  },
  {
    id: 'rq-9',
    question: 'Nomadic children learn how to _______ cattle at a very young age.',
    options: ['herd', 'fly', 'sail', 'bake'],
    correctIndex: 0,
    explanation: '"herd cattle" means to tend and drive a herd of animals together.',
    unitOrigin: 'Unit 2: Countryside',
  },
  {
    id: 'rq-10',
    question: 'Students can join the school _______ to discuss math problems freely.',
    options: ['forum', 'laser', 'cavern', 'pasture'],
    correctIndex: 0,
    explanation: 'A "forum" is an online discussion board or meeting place to exchange ideas.',
    unitOrigin: 'Unit 3: Teenagers',
  },
  {
    id: 'rq-11',
    question: 'He drives _______ than his brother because he is more cautious.',
    options: ['more carefully', 'carefullier', 'more careful', 'as careful'],
    correctIndex: 0,
    explanation: 'Modifying the action verb "drives" requires the comparative adverb "more carefully".',
    unitOrigin: 'Unit 2: Countryside',
  },
  {
    id: 'rq-12',
    question: 'Many adolescents suffer from _______ because they always compare themselves to classmates.',
    options: ['peer pressure', 'fresh air', 'origami', 'harvest'],
    correctIndex: 0,
    explanation: '"peer pressure" is the feeling of having to do things to be accepted by peers.',
    unitOrigin: 'Unit 3: Teenagers',
  },
  {
    id: 'rq-13',
    question: 'Find the mistake: "She is fond of collect stamps and coins."',
    options: ['is', 'fond of', 'collect', 'stamps'],
    correctIndex: 2,
    explanation: 'Change "collect" to "collecting" because the preposition "fond of" requires V-ing.',
    unitOrigin: 'High School Entrance Exam Focus',
  },
  {
    id: 'rq-14',
    question: 'Find the mistake: "He speaks English more fluently and gooder than before."',
    options: ['speaks', 'more fluently', 'gooder', 'before'],
    correctIndex: 2,
    explanation: 'Change "gooder" to "better" because the comparative adverb of "well" is "better".',
    unitOrigin: 'High School Entrance Exam Focus',
  },
  {
    id: 'rq-15',
    question: 'Which word has the stress on the FIRST syllable?',
    options: ['leisure', 'detest', 'connect', 'adore'],
    correctIndex: 0,
    explanation: '\'leisure is stressed on syllable 1. de\'test, con\'nect, and a\'dore are stressed on syllable 2.',
    unitOrigin: 'Stress Pattern Review',
  },
  {
    id: 'rq-16',
    question: 'The green rice paddy fields in the countryside look _______ than city skyscrapers.',
    options: ['more peaceful', 'peacefuller', 'as peaceful', 'peaceful'],
    correctIndex: 0,
    explanation: 'The two-syllable adjective "peaceful" takes "more peaceful" in the comparative.',
    unitOrigin: 'Unit 2: Countryside',
  },
  {
    id: 'rq-17',
    question: '_______ she was very tired after class, she helped her mother cook dinner.',
    options: ['Even though', 'Because', 'Since', 'So'],
    correctIndex: 0,
    explanation: '"Even though" indicates concession: Even though she was tired, she helped cook dinner.',
    unitOrigin: 'Unit 3: Teenagers',
  },
  {
    id: 'rq-18',
    question: 'Local villagers are always hospitable _______ any strangers visiting their hamlet.',
    options: ['to', 'with', 'at', 'about'],
    correctIndex: 0,
    explanation: 'The fixed preposition collocation is "hospitable to somebody".',
    unitOrigin: 'Unit 2: Countryside',
  },
  {
    id: 'rq-19',
    question: 'Choose the word with different ending sound -ed: /t/',
    options: ['cooked', 'watched', 'stopped', 'lived'],
    correctIndex: 3,
    explanation: '"lived" is pronounced with ending /d/. "cooked", "watched", and "stopped" end in /t/.',
    unitOrigin: 'Exam -ed Rules',
  },
  {
    id: 'rq-20',
    question: 'Final challenge: "If you practice speaking English daily, you _______ it faster."',
    options: ['will master', 'mastered', 'would master', 'master'],
    correctIndex: 0,
    explanation: 'Conditional sentence type 1: If + S + V (present simple), S + will + V-inf.',
    unitOrigin: 'Grade 8 Foundations',
  },
];

// Emergency Rescue Mini Quiz Questions (when Alert Level hits 100%)
export const RESCUE_QUESTIONS = [
  {
    id: 'resc-1',
    question: '🚨 DRAGON AWAKENED! Fire a grammar flare to distract the dragon: What verb form follows "like, adore, fond of"?',
    options: ['V-ing (Gerund)', 'To V-infinitive', 'V-ed (Past tense)', 'Bare Verb'],
    correctIndex: 0,
    explanation: 'Correct! Use V-ing (Gerund) to soothe the dragon back to sleep.',
  },
  {
    id: 'resc-2',
    question: '🚨 DRAGON STIRS! Choose the correct comparative adverb form of "early":',
    options: ['earlier', 'more early', 'earlyier', 'more earlier'],
    correctIndex: 0,
    explanation: 'Accurate! "Early" becomes "earlier". Alert level decreased immediately!',
  },
  {
    id: 'resc-3',
    question: '🚨 THROW SMOKE BOMB! Which conjunction expresses concession (although)?',
    options: ['Although / Even though', 'Because / Since', 'Therefore', 'In order to'],
    correctIndex: 0,
    explanation: 'Accurate! The smoke bomb blinded the dragon successfully!',
  },
];

// Re-export comprehensive creature catalog & mythical pets pool
export { CREATURES_CATALOG, MYTHICAL_PETS } from './creaturesData';
