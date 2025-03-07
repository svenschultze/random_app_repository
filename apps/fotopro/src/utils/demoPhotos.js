// Demo photos for testing the application

// Sample photo categories with direct Unsplash image URLs
const CATEGORIES = [
  {
    name: 'Nature',
    items: [
      { name: 'Mountain Sunset', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
      { name: 'Forest Path', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
      { name: 'Ocean Waves', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop' },
      { name: 'Desert Landscape', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&h=600&fit=crop' },
      { name: 'Waterfall', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=600&fit=crop' },
      { name: 'Autumn Leaves', url: 'https://images.unsplash.com/photo-1507783548227-544c3b8fc065?w=800&h=600&fit=crop' }
    ]
  },
  {
    name: 'City',
    items: [
      { name: 'Downtown Skyline', url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop' },
      { name: 'Street at Night', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop' },
      { name: 'Urban Architecture', url: 'https://images.unsplash.com/photo-1461695008884-03ca19f61ffa?w=800&h=600&fit=crop' },
      { name: 'City Park', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop' },
      { name: 'Bridge View', url: 'https://images.unsplash.com/photo-1445296608116-4059faad0f6f?w=800&h=600&fit=crop' }
    ]
  },
  {
    name: 'Travel',
    items: [
      { name: 'Beach Resort', url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&h=600&fit=crop' },
      { name: 'Historic Monument', url: 'https://images.unsplash.com/photo-1526711417-68e4a182a6c6?w=800&h=600&fit=crop' },
      { name: 'Mountain Cabin', url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop' },
      { name: 'Countryside Road', url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&h=600&fit=crop' },
      { name: 'Tropical Island', url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop' }
    ]
  },
  {
    name: 'Food',
    items: [
      { name: 'Gourmet Dish', url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&h=600&fit=crop' },
      { name: 'Fresh Fruits', url: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=600&fit=crop' },
      { name: 'Breakfast Spread', url: 'https://images.unsplash.com/photo-1533089860892-a9b969df83a3?w=800&h=600&fit=crop' },
      { name: 'Coffee Art', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop' },
      { name: 'Dessert Platter', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop' }
    ]
  }
]

// Function to load an image and convert it to data URL
async function loadImageAsDataURL(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error(`Error loading image from ${url}:`, error)
    // Return a fallback colored rectangle as data URL if image fails to load
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 80%)`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.font = '30px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Image placeholder', canvas.width / 2, canvas.height / 2)
    return canvas.toDataURL('image/jpeg')
  }
}

// Function to generate a demo photo with the given data
async function createDemoPhoto(name, url, albumId = null, tagIds = []) {
  const dataUrl = await loadImageAsDataURL(url)
  
  return {
    name,
    src: dataUrl,
    type: 'image/jpeg',
    size: Math.floor(Math.random() * 5000000) + 1000000, // Random size between 1-6MB
    albumId,
    tags: tagIds,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString() // Random date in last 30 days
  }
}

// Main function to generate demo data
export async function generateDemoData(photoStore) {
  try {
    console.log('Generating demo data...')
    
    // Create albums based on categories
    const albumIds = {}
    for (const category of CATEGORIES) {
      const albumId = photoStore.addAlbum(category.name)
      albumIds[category.name] = albumId
    }
    
    // Create some tags
    const tagIds = {
      'Favorites': photoStore.addTag('Favorites'),
      'Vacation': photoStore.addTag('Vacation'),
      'Family': photoStore.addTag('Family'),
      'Work': photoStore.addTag('Work'),
      'Landscape': photoStore.addTag('Landscape'),
      'Portrait': photoStore.addTag('Portrait')
    }
    
    // Load photos from each category
    for (const category of CATEGORIES) {
      for (const item of category.items) {
        // Randomly assign tags
        const randomTags = []
        
        // Add landscape tag to nature category
        if (category.name === 'Nature') {
          randomTags.push(tagIds['Landscape'])
        }
        
        // Randomly add favorites tag (20% chance)
        if (Math.random() < 0.2) {
          randomTags.push(tagIds['Favorites'])
        }
        
        // Randomly add vacation tag (30% chance for travel category)
        if (category.name === 'Travel' || Math.random() < 0.3) {
          randomTags.push(tagIds['Vacation'])
        }
        
        // Create the photo with the album ID for this category
        const photo = await createDemoPhoto(
          item.name, 
          item.url, 
          albumIds[category.name],
          randomTags
        )
        
        // Add to store
        photoStore.addPhoto(photo)
      }
    }
    
    console.log('Demo data generation complete!')
    return true
  } catch (error) {
    console.error('Error generating demo data:', error)
    return false
  }
}