export const mockHotels = [
    {
      hotel: {
        hotelId: 'MOCK001',
        name: 'Luxury Beachfront Resort',
        rating: 4.8,
        amenities: ['Pool', 'Spa', 'Gym', 'WiFi', 'Restaurant'],
        address: {
          cityName: 'Tropical Beach City',
        },
        media: [
          { uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' }
        ],
        latitude: 1.3521,
        longitude: 103.8198,
      },
      offers: [
        {
          price: {
            total: '299.00',
            currency: 'USD'
          }
        }
      ]
    },
    {
      hotel: {
        hotelId: 'MOCK002',
        name: 'Urban Business Hotel',
        rating: 4.5,
        amenities: ['WiFi', 'Business Center', 'Restaurant', 'Bar'],
        address: {
          cityName: 'Metropolitan Downtown',
        },
        media: [
          { uri: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa' }
        ],
        latitude: 1.3551,
        longitude: 103.8478,
      },
      offers: [
        {
          price: {
            total: '199.00',
            currency: 'USD'
          }
        }
      ]
    },
    {
      hotel: {
        hotelId: 'MOCK003',
        name: 'Family Adventure Resort',
        rating: 4.3,
        amenities: ['Pool', 'Kids Club', 'Restaurant', 'Entertainment'],
        address: {
          cityName: 'Family Fun City',
        },
        media: [
          { uri: 'https://images.unsplash.com/photo-1582719508461-905c673771fd' }
        ],
        latitude: 1.3231,
        longitude: 103.7998,
      },
      offers: [
        {
          price: {
            total: '259.00',
            currency: 'USD'
          }
        }
      ]
    }
  ];


  // Mock Data for Travel Website

export const featuredDestinations = [
    {
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1533371452382-d45a9da51ad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      description: 'Tropical paradise with pristine beaches, lush rice terraces, and vibrant culture.',
      rating: 4.8,
      price: 'From $75/night'
    },
    {
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      description: 'The city of love, art, cuisine, and iconic landmarks like the Eiffel Tower.',
      rating: 4.9,
      price: 'From $150/night'
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://www.diplomatisches-magazin.de/fileadmin/_processed_/f/4/csm_jezael-melgoza-1127048-unsplash_3af6a70a55.jpg',
      description: 'A mesmerizing blend of ultramodern technology and traditional culture.',
      rating: 4.7,
      price: 'From $120/night'
    },
    {
      name: 'New York, USA',
      image: 'https://images.pexels.com/photos/1239162/pexels-photo-1239162.jpeg?cs=srgb&dl=pexels-mikel-1239162.jpg&fm=jpg',
      description: 'The city that never sleeps, packed with iconic skyscrapers and cultural diversity.',
      rating: 4.6,
      price: 'From $200/night'
    }
  ];
  
  export const deals = [
    {
      title: 'Bali Tropical Escape',
      image: 'https://media-cdn.tripadvisor.com/media/photo-s/15/24/2c/49/samabe-bali-suites-villas.jpg',
      description: '50% Off on Selected Beachfront Resorts',
      discount: '50% OFF',
      originalPrice: '$300',
      newPrice: '$150'
    },
    {
      title: 'European City Break',
      image: 'https://www.thetimes.com/imageserver/image/%2F7651b7f1-08b2-4abd-8d6c-93f658f852c3.jpg?crop=4500%2C2531%2C0%2C469',
      description: 'Weekend Getaway in Paris with Luxury Hotel',
      discount: '40% OFF',
      originalPrice: '$300',
      newPrice: '$190'
    },
    {
      title: 'India Culture Experience',
      image: 'https://www.exoticca.com/_next/image?url=https%3A%2F%2Fuploads.exoticca.com%2Fglobal%2Fdestination%2Fpoi%2Fjodhpur.png&w=3840&q=75',
      description: 'Explore India with Inclusive Tour Package',
      discount: '30% OFF',
      originalPrice: '$250',
      newPrice: '$150'
    }
  ];
  
  export const travelIdeas = [
    {
      title: 'Weekend Beach Getaways',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80',
      description: 'Discover the most breathtaking beaches for a quick weekend escape.',
      readMoreLink: '#beach-getaways'
    },
    {
      title: 'Top Family Destinations',
      image: 'https://elizabethstreet.com/wp-content/uploads/2013/05/40.jpg',
      description: 'Perfect places to visit with your loved ones, offering fun for all ages.',
      readMoreLink: '#family-destinations'
    },
    {
      title: 'Adventure Travel Guide',
      image: 'https://www.muchbetteradventures.com/_next/image/?url=https%3A%2F%2Fimages.ctfassets.net%2Fm5us57n7qfgl%2F6HemqTWt0t4FGOf3eh1KoT%2Fb6525d8f41d5d3103455fb97c9b98c06%2FPackrafting_lesson__Montenegro__Tara_River_Host.jpg&w=2048&q=50',
      description: 'Embark on thrilling experiences and adrenaline-pumping adventures worldwide.',
      readMoreLink: '#adventure-travel'
    }
  ];





  export const additionalImages = [
      // Fallback images if no hotel images are available
      'https://images.unsplash.com/photo-1566195992011-5f6b7324ad04',
      'https://images.unsplash.com/photo-1582719478250-c10d0bddb8f3',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
    ];
  
    export const mockReviews = [
      {
        name: 'Jack H.',
        rating: 5,
        date: 'March 2024',
        text: 'Absolutely amazing hotel! The service was impeccable and the room was spacious and clean.',
        pros: ['Great location', 'Friendly staff', 'Comfortable beds']
      },
      {
        name: 'Sarah M.',
        rating: 4,
        date: 'February 2024',
        text: 'Really enjoyed my stay. The amenities were top-notch and the view was breathtaking.',
        pros: ['Beautiful view', 'Excellent breakfast', 'Modern facilities']
      },
      {
        name: 'Mike R.',
        rating: 5,
        date: 'January 2024',
        text: 'Perfect for both business and leisure. The business center and gym were exactly what I needed.',
        pros: ['Convenient workspace', 'Well-equipped gym', 'Excellent Wi-Fi']
      }
    ];