export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyType: "house" | "apartment" | "condo" | "townhouse" | "land";
  status: "active" | "pending" | "sold";
  priceCents: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  virtualTourUrl?: string;
  yearBuilt: number;
  amenities: string[];
  photos: { url: string; alt: string; isPrimary: boolean }[];
  agent: AgentProfile;
  createdAt: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  agencyName: string;
  avatarUrl: string;
  bio: string;
  listingCount: number;
  rating: number;
  reviewCount: number;
}

export const mockAgents: AgentProfile[] = [
  {
    id: "a1",
    name: "Sarah Johnson",
    email: "sarah@realty.com",
    phone: "+1 (555) 123-4567",
    agencyName: "Premier Realty Group",
    avatarUrl: "https://i.pravatar.cc/150?u=sarah",
    bio: "Specializing in luxury residential properties with over 15 years of experience.",
    listingCount: 42,
    rating: 4.9,
    reviewCount: 156,
  },
  {
    id: "a2",
    name: "Michael Chen",
    email: "michael@urbanestates.com",
    phone: "+1 (555) 234-5678",
    agencyName: "Urban Estates",
    avatarUrl: "https://i.pravatar.cc/150?u=michael",
    bio: "Your trusted guide for downtown condos and city living.",
    listingCount: 38,
    rating: 4.8,
    reviewCount: 142,
  },
  {
    id: "a3",
    name: "Emily Rodriguez",
    email: "emily@homefinders.com",
    phone: "+1 (555) 345-6789",
    agencyName: "HomeFinders Inc.",
    avatarUrl: "https://i.pravatar.cc/150?u=emily",
    bio: "Family-focused real estate with a passion for finding the perfect home.",
    listingCount: 55,
    rating: 4.7,
    reviewCount: 198,
  },
];

export const mockListings: Property[] = [
  {
    id: "1",
    slug: "modern-downtown-loft-portland",
    title: "Modern Downtown Loft with City Views",
    description:
      "Stunning open-concept loft featuring floor-to-ceiling windows, exposed brick walls, and a chef's kitchen with quartz countertops. Located in the heart of downtown with walkable access to restaurants, shops, and public transit. The building offers a rooftop terrace, fitness center, and secure parking.",
    propertyType: "apartment",
    status: "active",
    priceCents: 42500000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1200,
    address: "450 SW Morrison St",
    city: "Portland",
    state: "OR",
    zip: "97204",
    latitude: 45.5189,
    longitude: -122.6764,
    yearBuilt: 2019,
    amenities: ["air_conditioning", "elevator", "gym", "rooftop", "parking"],
    photos: [
      { url: "/photos/loft-1.jpg", alt: "Living room with city views", isPrimary: true },
      { url: "/photos/loft-2.jpg", alt: "Modern kitchen", isPrimary: false },
      { url: "/photos/loft-3.jpg", alt: "Master bedroom", isPrimary: false },
      { url: "/photos/loft-4.jpg", alt: "Bathroom", isPrimary: false },
    ],
    agent: mockAgents[0],
    createdAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "2",
    slug: "charming-craftsman-bungalow",
    title: "Charming Craftsman Bungalow",
    description:
      "Beautifully restored 1920s craftsman bungalow on a tree-lined street. Features original hardwood floors, built-in bookshelves, and a wrap-around porch. Updated kitchen and bathrooms while maintaining period charm. Large backyard with mature landscaping and a detached garage.",
    propertyType: "house",
    status: "active",
    priceCents: 58500000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1850,
    address: "2834 NE Klickitat St",
    city: "Portland",
    state: "OR",
    zip: "97212",
    latitude: 45.5451,
    longitude: -122.6396,
    yearBuilt: 1924,
    amenities: ["garage", "garden", "hardwood_floors", "porch"],
    photos: [
      { url: "/photos/bungalow-1.jpg", alt: "Front exterior", isPrimary: true },
      { url: "/photos/bungalow-2.jpg", alt: "Living room", isPrimary: false },
      { url: "/photos/bungalow-3.jpg", alt: "Kitchen", isPrimary: false },
    ],
    agent: mockAgents[1],
    createdAt: "2026-03-10T14:00:00Z",
  },
  {
    id: "3",
    slug: "luxury-waterfront-estate",
    title: "Luxury Waterfront Estate",
    description:
      "Magnificent waterfront property with panoramic river views. This estate features 5 bedrooms, a gourmet kitchen, home theater, wine cellar, and private dock. The master suite includes a spa bathroom and private balcony. Professionally landscaped grounds with pool and outdoor kitchen.",
    propertyType: "house",
    status: "active",
    priceCents: 215000000,
    bedrooms: 5,
    bathrooms: 4.5,
    areaSqft: 4800,
    address: "1200 SW River Dr",
    city: "Lake Oswego",
    state: "OR",
    zip: "97034",
    latitude: 45.4207,
    longitude: -122.6706,
    virtualTourUrl: "https://my.matterport.com/show/?m=example",
    yearBuilt: 2021,
    amenities: ["pool", "garage", "air_conditioning", "garden", "waterfront", "wine_cellar"],
    photos: [
      { url: "/photos/estate-1.jpg", alt: "Waterfront view", isPrimary: true },
      { url: "/photos/estate-2.jpg", alt: "Grand living room", isPrimary: false },
      { url: "/photos/estate-3.jpg", alt: "Gourmet kitchen", isPrimary: false },
      { url: "/photos/estate-4.jpg", alt: "Pool area", isPrimary: false },
      { url: "/photos/estate-5.jpg", alt: "Master suite", isPrimary: false },
    ],
    agent: mockAgents[0],
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "4",
    slug: "urban-studio-pearl-district",
    title: "Urban Studio in the Pearl District",
    description:
      "Efficient and stylish studio in Portland's vibrant Pearl District. Features high ceilings, modern finishes, and a Murphy bed for flexible living. Building amenities include a shared rooftop deck, bike storage, and package lockers. Steps from galleries, breweries, and the streetcar line.",
    propertyType: "apartment",
    status: "active",
    priceCents: 27500000,
    bedrooms: 0,
    bathrooms: 1,
    areaSqft: 550,
    address: "1150 NW Quimby St",
    city: "Portland",
    state: "OR",
    zip: "97209",
    latitude: 45.5327,
    longitude: -122.6849,
    yearBuilt: 2017,
    amenities: ["elevator", "bike_storage", "rooftop"],
    photos: [
      { url: "/photos/studio-1.jpg", alt: "Open living space", isPrimary: true },
      { url: "/photos/studio-2.jpg", alt: "Kitchen area", isPrimary: false },
    ],
    agent: mockAgents[2],
    createdAt: "2026-03-20T11:00:00Z",
  },
  {
    id: "5",
    slug: "family-home-lake-oswego",
    title: "Spacious Family Home with Pool",
    description:
      "Perfect family home in a top-rated school district. Open floor plan with vaulted ceilings, formal dining room, and a spacious family room. The backyard is an entertainer's dream with a heated pool, covered patio, and built-in BBQ. Three-car garage with EV charging.",
    propertyType: "house",
    status: "active",
    priceCents: 87500000,
    bedrooms: 4,
    bathrooms: 3,
    areaSqft: 3200,
    address: "456 Lakeview Blvd",
    city: "Lake Oswego",
    state: "OR",
    zip: "97035",
    latitude: 45.4137,
    longitude: -122.6659,
    yearBuilt: 2015,
    amenities: ["pool", "garage", "air_conditioning", "garden", "ev_charging"],
    photos: [
      { url: "/photos/family-1.jpg", alt: "Front exterior", isPrimary: true },
      { url: "/photos/family-2.jpg", alt: "Pool area", isPrimary: false },
      { url: "/photos/family-3.jpg", alt: "Kitchen", isPrimary: false },
      { url: "/photos/family-4.jpg", alt: "Master bedroom", isPrimary: false },
    ],
    agent: mockAgents[1],
    createdAt: "2026-03-12T16:00:00Z",
  },
  {
    id: "6",
    slug: "hillside-townhouse-west-hills",
    title: "Contemporary Hillside Townhouse",
    description:
      "Sleek contemporary townhouse nestled in Portland's West Hills. Features an open main level with walls of glass framing forest views. Chef's kitchen with waterfall island, two en-suite bedrooms, and a private rooftop deck. Attached 2-car garage with direct entry.",
    propertyType: "townhouse",
    status: "active",
    priceCents: 67500000,
    bedrooms: 2,
    bathrooms: 2.5,
    areaSqft: 1650,
    address: "3021 SW Fairview Blvd",
    city: "Portland",
    state: "OR",
    zip: "97205",
    latitude: 45.5247,
    longitude: -122.7131,
    yearBuilt: 2022,
    amenities: ["garage", "air_conditioning", "balcony"],
    photos: [
      { url: "/photos/townhouse-1.jpg", alt: "Exterior", isPrimary: true },
      { url: "/photos/townhouse-2.jpg", alt: "Living room", isPrimary: false },
      { url: "/photos/townhouse-3.jpg", alt: "Kitchen", isPrimary: false },
    ],
    agent: mockAgents[2],
    createdAt: "2026-03-18T13:00:00Z",
  },
  {
    id: "7",
    slug: "development-land-beaverton",
    title: "Prime Development Land - 2.5 Acres",
    description:
      "Exceptional development opportunity in rapidly growing Beaverton. 2.5 acres of flat, cleared land zoned for residential. All utilities available at the lot line. Preliminary plat approval for 12 single-family lots. Near MAX light rail, shopping centers, and Nike campus.",
    propertyType: "land",
    status: "active",
    priceCents: 125000000,
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 108900,
    address: "0 SW Murray Blvd",
    city: "Beaverton",
    state: "OR",
    zip: "97005",
    latitude: 45.4871,
    longitude: -122.7936,
    yearBuilt: 0,
    amenities: [],
    photos: [
      { url: "/photos/land-1.jpg", alt: "Aerial view", isPrimary: true },
    ],
    agent: mockAgents[0],
    createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "8",
    slug: "penthouse-condo-south-waterfront",
    title: "Penthouse Condo with 360 Views",
    description:
      "Breathtaking penthouse with floor-to-ceiling windows offering 360-degree views of Mt. Hood, the Willamette River, and the city skyline. Luxury finishes throughout including marble floors, custom cabinetry, and a gourmet kitchen. Building features 24/7 concierge, pool, and private wine storage.",
    propertyType: "condo",
    status: "active",
    priceCents: 175000000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2800,
    address: "3601 S River Pkwy #PH1",
    city: "Portland",
    state: "OR",
    zip: "97239",
    latitude: 45.4976,
    longitude: -122.6714,
    virtualTourUrl: "https://my.matterport.com/show/?m=example2",
    yearBuilt: 2023,
    amenities: ["pool", "elevator", "concierge", "gym", "wine_cellar", "air_conditioning"],
    photos: [
      { url: "/photos/penthouse-1.jpg", alt: "Panoramic views", isPrimary: true },
      { url: "/photos/penthouse-2.jpg", alt: "Living room", isPrimary: false },
      { url: "/photos/penthouse-3.jpg", alt: "Master suite", isPrimary: false },
      { url: "/photos/penthouse-4.jpg", alt: "Kitchen", isPrimary: false },
    ],
    agent: mockAgents[2],
    createdAt: "2026-03-08T15:00:00Z",
  },
];

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatArea(sqft: number): string {
  return new Intl.NumberFormat("en-US").format(sqft);
}
