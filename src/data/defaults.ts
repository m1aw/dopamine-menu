import type { MenuItem } from '@/types';

export const DEFAULT_ITEMS: MenuItem[] = [
  // Salads
  { id: 'd1', name: 'Go for a walk', description: 'Even 10 minutes outside resets the nervous system', category: 'salad' },
  { id: 'd2', name: 'Do 5 minutes of stretching', description: 'Floor stretches, no equipment needed', category: 'salad' },
  { id: 'd3', name: 'Tidy one small area', description: 'One drawer, one shelf — done', category: 'salad' },
  { id: 'd4', name: 'Write in journal', description: 'Stream of consciousness, no rules', category: 'salad' },
  { id: 'd5', name: 'Drink a full glass of water', description: 'Hydration is a radical act', category: 'salad' },
  { id: 'd6', name: 'Make your bed', description: 'Instant win, sets the tone', category: 'salad' },

  // Sides
  { id: 'd7', name: 'Listen to a podcast', description: 'Something you\'ve been saving', category: 'side' },
  { id: 'd8', name: 'Doodle or sketch', description: 'No goal, just mess around on paper', category: 'side' },
  { id: 'd9', name: 'Make a cup of tea or coffee', description: 'The ritual is the point', category: 'side' },
  { id: 'd10', name: 'Scroll through saved articles', description: 'Actually read one of them', category: 'side' },
  { id: 'd11', name: 'Send a voice note to a friend', description: 'Low effort, high connection', category: 'side' },

  // Entrees
  { id: 'd12', name: 'Watch a favorite show episode', description: 'Something familiar and comforting', category: 'entree' },
  { id: 'd13', name: 'Cook or bake something', description: 'Even simple food counts', category: 'entree' },
  { id: 'd14', name: 'Play a video game', description: '30–60 min of intentional play', category: 'entree' },
  { id: 'd15', name: 'Work on a hobby project', description: 'Something you actually enjoy', category: 'entree' },
  { id: 'd16', name: 'Read a book or comic', description: 'Physical or digital, your choice', category: 'entree' },
  { id: 'd17', name: 'Go for a bike ride', description: 'Explore somewhere new or a familiar route', category: 'entree' },

  // Desserts
  { id: 'd18', name: 'Doomscroll social media', description: 'Set a timer so it doesn\'t eat the day', category: 'dessert' },
  { id: 'd19', name: 'Binge-watch a new series', description: 'Best enjoyed with snacks and a soft blanket', category: 'dessert' },
  { id: 'd20', name: 'Order takeout', description: 'No dishes, full flavor', category: 'dessert' },
  { id: 'd21', name: 'Spend time on Reddit', description: 'Deep dive into a niche rabbit hole', category: 'dessert' },
  { id: 'd22', name: 'Online shopping (window only)', description: 'Fill the cart, close the tab', category: 'dessert' },

  // Specials
  { id: 'd23', name: 'Plan a day trip', description: 'Pick somewhere and actually book it', category: 'special' },
  { id: 'd24', name: 'Attend a live event', description: 'Concert, sports, standup — something with energy', category: 'special' },
  { id: 'd25', name: 'Try a new restaurant', description: 'Somewhere you\'ve been curious about', category: 'special' },
  { id: 'd26', name: 'Take a spontaneous afternoon off', description: 'Full permission to do whatever you want', category: 'special' },
  { id: 'd27', name: 'Learn something completely new', description: 'A skill, topic, or craft you\'ve been curious about', category: 'special' },
];
