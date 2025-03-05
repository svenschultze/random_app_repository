export const meals = [
  {
    id: 1,
    type: 'breakfast',
    name: 'Avocado Toast with Poached Eggs',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    calories: 420,
    protein: 18,
    carbs: 35,
    fat: 25,
    dietary: ['vegetarian', 'high-protein'],
    instructions: 'Toast whole grain bread, mash avocado on top, add poached eggs, season with salt, pepper, and red pepper flakes.',
    time: '15 minutes'
  },
  {
    id: 2,
    type: 'breakfast',
    name: 'Berry Oatmeal Bowl',
    image: 'https://images.unsplash.com/photo-1517093702248-8363fca96e2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    calories: 320,
    protein: 12,
    carbs: 58,
    fat: 6,
    dietary: ['vegan', 'dairy-free', 'gluten-free'],
    instructions: 'Cook oats with plant milk, top with mixed berries, chia seeds, and a drizzle of maple syrup.',
    time: '10 minutes'
  },
  {
    id: 3,
    type: 'lunch',
    name: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    calories: 480,
    protein: 15,
    carbs: 62,
    fat: 18,
    dietary: ['vegan', 'gluten-free'],
    instructions: 'Mix cooked quinoa with diced cucumber, tomatoes, olives, and chickpeas. Dress with olive oil and lemon juice.',
    time: '20 minutes'
  },
  {
    id: 4,
    type: 'lunch',
    name: 'Grilled Chicken Salad',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    calories: 380,
    protein: 32,
    carbs: 20,
    fat: 15,
    dietary: ['high-protein', 'low-carb'],
    instructions: 'Grill chicken breast, slice and serve over mixed greens with cherry tomatoes, avocado, and balsamic vinaigrette.',
    time: '25 minutes'
  },
  {
    id: 5,
    type: 'dinner',
    name: 'Baked Salmon with Roasted Vegetables',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    calories: 520,
    protein: 35,
    carbs: 30,
    fat: 28,
    dietary: ['high-protein', 'keto-friendly', 'gluten-free'],
    instructions: 'Season salmon with herbs, bake until flaky. Serve with roasted Brussels sprouts and sweet potatoes.',
    time: '30 minutes'
  },
  {
    id: 6,
    type: 'dinner',
    name: 'Vegetable Stir-Fry with Tofu',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    calories: 380,
    protein: 22,
    carbs: 40,
    fat: 15,
    dietary: ['vegan', 'gluten-free'],
    instructions: 'Stir-fry firm tofu with broccoli, bell peppers, snap peas, and carrots in a ginger-garlic sauce. Serve with brown rice.',
    time: '25 minutes'
  },
  {
    id: 7,
    type: 'snack',
    name: 'Greek Yogurt with Honey and Nuts',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    calories: 220,
    protein: 15,
    carbs: 18,
    fat: 10,
    dietary: ['vegetarian', 'high-protein'],
    instructions: 'Top Greek yogurt with a drizzle of honey, mixed nuts, and a sprinkle of cinnamon.',
    time: '5 minutes'
  },
  {
    id: 8,
    type: 'snack',
    name: 'Apple Slices with Almond Butter',
    image: 'https://images.unsplash.com/photo-1479490382060-5e308c694b10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    calories: 180,
    protein: 5,
    carbs: 25,
    fat: 8,
    dietary: ['vegan', 'gluten-free'],
    instructions: 'Slice a medium apple and serve with 1-2 tablespoons of almond butter for dipping.',
    time: '5 minutes'
  }
];

export const dietaryPreferences = [
  { value: 'all', label: 'All Meals' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'high-protein', label: 'High Protein' },
  { value: 'low-carb', label: 'Low Carb' },
  { value: 'keto-friendly', label: 'Keto Friendly' }
];