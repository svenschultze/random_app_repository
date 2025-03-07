import { ref, reactive, computed } from 'vue'

// Create a single instance of the store
const restaurants = ref([])
const cart = reactive({
  items: [],
  total: 0
})

export const useRestaurantStore = () => {

  // Generate random restaurants with menus
  const generateRestaurants = () => {
    const cuisineTypes = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'American', 'Greek', 'French', 'Mediterranean']
    const categories = ['Appetizers', 'Main Course', 'Desserts', 'Drinks', 'Sides']
    
    const randomRestaurants = []
    
    for (let i = 1; i <= 10; i++) {
      const restaurantId = `rest-${i}`
      const restaurant = {
        id: restaurantId,
        name: generateRestaurantName(),
        cuisine: cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)],
        rating: (Math.floor(Math.random() * 40) + 10) / 10, // Rating from 1.0 to 5.0
        image: `https://picsum.photos/seed/${restaurantId}/300/200`,
        description: generateDescription(),
        menu: []
      }
      
      // Generate menu items for each category
      categories.forEach(category => {
        const itemCount = Math.floor(Math.random() * 4) + 2 // 2-5 items per category
        
        for (let j = 1; j <= itemCount; j++) {
          const itemId = `${restaurantId}-item-${category.toLowerCase()}-${j}`
          const price = (Math.floor(Math.random() * 1500) + 500) / 100 // $5.00 to $20.00
          const hasDiscount = Math.random() > 0.8
          
          restaurant.menu.push({
            id: itemId,
            category,
            name: generateItemName(category),
            price,
            description: generateItemDescription(),
            image: `https://picsum.photos/seed/${itemId}/200/150`,
            discount: hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0, // 10% to 40% discount
          })
        }
      })
      
      randomRestaurants.push(restaurant)
    }
    
    restaurants.value = randomRestaurants
    saveToLocalStorage()
  }
  
  // Get restaurant by ID
  const getRestaurant = (id) => {
    return restaurants.value.find(r => r.id === id) || null
  }
  
  // Add item to cart
  const addToCart = (item, restaurantId, quantity = 1) => {
    console.log('Adding to cart:', item)
    console.log('Restaurant ID:', restaurantId)
    console.log('Quantity:', quantity)
    
    const restaurant = getRestaurant(restaurantId)
    if (!restaurant) {
      console.error(`Restaurant with ID ${restaurantId} not found when adding to cart`)
      return
    }
    
    const existingItem = cart.items.find(cartItem => cartItem.itemId === item.id)
    
    if (existingItem) {
      console.log('Updating existing item in cart')
      existingItem.quantity += quantity
    } else {
      console.log('Adding new item to cart')
      cart.items.push({
        itemId: item.id,
        restaurantId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
        discount: item.discount || 0
      })
    }
    
    updateCartTotal()
    console.log('Updated cart:', cart.items)
    console.log('New cart total:', cart.total)
    saveToLocalStorage()
  }
  
  // Update cart item quantity
  const updateCartItemQuantity = (itemId, quantity) => {
    const item = cart.items.find(item => item.itemId === itemId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(itemId)
      } else {
        updateCartTotal()
        saveToLocalStorage()
      }
    }
  }
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    const index = cart.items.findIndex(item => item.itemId === itemId)
    if (index !== -1) {
      cart.items.splice(index, 1)
      updateCartTotal()
      saveToLocalStorage()
    }
  }
  
  // Clear cart
  const clearCart = () => {
    cart.items = []
    cart.total = 0
    saveToLocalStorage()
  }
  
  // Update cart total
  const updateCartTotal = () => {
    const newTotal = cart.items.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discount / 100)
      const itemTotal = discountedPrice * item.quantity
      console.log(`Item ${item.name}: ${item.quantity} × $${discountedPrice.toFixed(2)} = $${itemTotal.toFixed(2)}`)
      return total + itemTotal
    }, 0)
    
    console.log(`New cart total: $${newTotal.toFixed(2)}`)
    cart.total = newTotal
  }
  
  // Load from localStorage
  const loadFromLocalStorage = () => {
    try {
      const storedData = localStorage.getItem('foodExpressData')
      if (storedData) {
        console.log('Loading data from localStorage')
        const data = JSON.parse(storedData)
        
        if (data.restaurants && Array.isArray(data.restaurants) && data.restaurants.length > 0) {
          console.log(`Found ${data.restaurants.length} restaurants in localStorage`)
          restaurants.value = data.restaurants
        } else {
          console.log('No valid restaurants in localStorage, generating new data')
          generateRestaurants()
        }
        
        if (data.cart) {
          cart.items = data.cart.items || []
          cart.total = data.cart.total || 0
        }
      } else {
        console.log('No data in localStorage, generating new restaurants')
        generateRestaurants()
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
      generateRestaurants()
    }
  }
  
  // Save to localStorage
  const saveToLocalStorage = () => {
    try {
      console.log('Saving data to localStorage')
      const data = {
        restaurants: restaurants.value,
        cart: {
          items: cart.items,
          total: cart.total
        }
      }
      localStorage.setItem('foodExpressData', JSON.stringify(data))
      console.log(`Saved ${restaurants.value.length} restaurants to localStorage`)
    } catch (error) {
      console.error('Error saving data to localStorage:', error)
    }
  }
  
  // Get cart item count
  const cartItemCount = computed(() => {
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  })
  
  // Generate random names and descriptions
  function generateRestaurantName() {
    const prefixes = ['Tasty', 'Delicious', 'Spicy', 'Savory', 'Gourmet', 'Fresh', 'Homestyle', 'Authentic']
    const names = ['Kitchen', 'Bistro', 'Cafe', 'Grill', 'Restaurant', 'Diner', 'Eatery', 'Palace', 'Garden', 'House']
    
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]}`
  }
  
  function generateDescription() {
    const descriptions = [
      'A cozy spot with friendly service and delicious food.',
      'Family-owned restaurant serving authentic recipes.',
      'Modern dining experience with innovative menu options.',
      'Traditional recipes with a contemporary twist.',
      'Award-winning chef creating unforgettable flavors.',
      'Fast service and quality ingredients at affordable prices.',
      'Upscale dining in a casual, welcoming atmosphere.',
      'Fresh, locally-sourced ingredients in every dish.'
    ]
    
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }
  
  function generateItemName(category) {
    let names = []
    
    switch (category) {
      case 'Appetizers':
        names = ['Spring Rolls', 'Garlic Bread', 'Fried Calamari', 'Bruschetta', 'Nachos', 'Spinach Dip', 'Buffalo Wings', 'Stuffed Mushrooms']
        break
      case 'Main Course':
        names = ['Grilled Salmon', 'Chicken Parmesan', 'Beef Stir Fry', 'Veggie Burger', 'Pasta Primavera', 'Lamb Curry', 'BBQ Ribs', 'Shrimp Scampi']
        break
      case 'Desserts':
        names = ['Chocolate Cake', 'Tiramisu', 'Cheesecake', 'Apple Pie', 'Ice Cream Sundae', 'Crème Brûlée', 'Fruit Tart', 'Brownie']
        break
      case 'Drinks':
        names = ['Lemonade', 'Iced Tea', 'Smoothie', 'Coffee', 'Milkshake', 'Soda', 'Juice', 'Water']
        break
      case 'Sides':
        names = ['French Fries', 'Mashed Potatoes', 'Steamed Vegetables', 'Rice Pilaf', 'Coleslaw', 'Onion Rings', 'Side Salad', 'Soup']
        break
      default:
        names = ['Special Dish', 'Chef\'s Creation', 'House Special', 'Signature Item']
    }
    
    return names[Math.floor(Math.random() * names.length)]
  }
  
  function generateItemDescription() {
    const descriptions = [
      'Made with the freshest ingredients for a delicious taste.',
      'A customer favorite that never disappoints.',
      'Our chef\'s special recipe passed down through generations.',
      'A perfect blend of flavors that will leave you wanting more.',
      'Prepared daily with locally-sourced ingredients.',
      'A unique twist on a classic favorite.',
      'Seasoned to perfection and cooked just right.',
      'Light, refreshing, and full of flavor.'
    ]
    
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }
  
  return {
    restaurants,
    cart,
    cartItemCount,
    generateRestaurants,
    getRestaurant,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    loadFromLocalStorage
  }
}