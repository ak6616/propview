import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ── City data with realistic coordinates and voivodeships ──
const CITIES = [
  { city: "Warszawa", state: "mazowieckie", lat: 52.2297, lng: 21.0122, zips: ["00-120", "01-234", "02-624", "03-301", "04-175", "00-660", "02-001", "01-530"] },
  { city: "Kraków", state: "małopolskie", lat: 50.0647, lng: 19.9450, zips: ["30-001", "31-131", "31-056", "30-150", "30-347", "31-476", "30-503", "31-261"] },
  { city: "Wrocław", state: "dolnośląskie", lat: 51.1079, lng: 17.0385, zips: ["50-001", "53-108", "53-235", "51-612", "52-407", "54-130", "50-370", "51-162"] },
  { city: "Gdańsk", state: "pomorskie", lat: 54.3520, lng: 18.6466, zips: ["80-001", "80-254", "80-462", "80-172", "80-803", "80-560", "80-344", "80-952"] },
  { city: "Poznań", state: "wielkopolskie", lat: 52.4064, lng: 16.9252, zips: ["60-001", "60-529", "61-807", "60-166", "61-131", "60-785", "61-612", "60-324"] },
  { city: "Łódź", state: "łódzkie", lat: 51.7592, lng: 19.4560, zips: ["90-001", "91-002", "92-003", "93-004", "94-005", "90-255", "91-341", "92-108"] },
  { city: "Katowice", state: "śląskie", lat: 50.2649, lng: 19.0238, zips: ["40-001", "40-098", "40-203", "40-555", "40-723", "40-084", "40-161", "40-340"] },
  { city: "Lublin", state: "lubelskie", lat: 51.2465, lng: 22.5684, zips: ["20-001", "20-077", "20-400", "20-601", "20-150", "20-325", "20-718", "20-950"] },
] as const;

// ── Street names by city ──
const STREETS: Record<string, string[]> = {
  Warszawa: ["Marszałkowska", "Puławska", "Kasprzaka", "Złota", "Mokotowska", "Nowy Świat", "Hoża", "Wiejska", "Żoliborska", "Prosta", "Grzybowska", "Emilii Plater", "Aleje Jerozolimskie", "Świętokrzyska", "Targowa"],
  Kraków: ["Karmelicka", "Józefa", "Dietla", "Grodzka", "Długa", "Mogilska", "Wielicka", "Podgórska", "Lea", "Basztowa", "Starowiślna", "Floriańska", "Krakowska", "Nawojki", "Kijowska"],
  Wrocław: ["Ślężna", "Grabiszyńska", "Hallera", "Powstańców Śląskich", "Legnicka", "Kościuszki", "Piłsudskiego", "Kazimierza Wielkiego", "Ruska", "Świdnicka", "Jedności Narodowej", "Trzebnicka", "Milicka", "Młodych Techników", "Krakowska"],
  Gdańsk: ["Partyzantów", "Grunwaldzka", "Długa", "Rajska", "Podwale Grodzkie", "Wały Jagiellońskie", "Kartuska", "Marynarki Polskiej", "Oliwska", "Chłopska", "Kołobrzeska", "Subisława", "Uphagena", "Startowa", "Jabłoniowa"],
  Poznań: ["Dąbrowskiego", "Św. Marcin", "Głogowska", "Garbary", "Półwiejska", "Ratajczaka", "Bukowska", "Roosevelta", "Solna", "Matejki", "Libelta", "Wierzbięcice", "Szamarzewskiego", "Chwaliszewo", "Podgórna"],
  Łódź: ["Piotrkowska", "Narutowicza", "Kościuszki", "Sienkiewicza", "Piłsudskiego", "Kilińskiego", "Żeromskiego", "Mickiewicza", "Wschodnia", "Zachodnia", "Tymienieckiego", "Rewolucji 1905 r.", "Gdańska", "Legionów", "Wólczańska"],
  Katowice: ["Korfantego", "Warszawska", "Chorzowska", "Mikołowska", "Sokolska", "Pułaskiego", "Kościuszki", "Stawowa", "Mariacka", "Dworcowa", "Pocztowa", "Rynek", "Młyńska", "Jagiellońska", "Damrota"],
  Lublin: ["Krakowskie Przedmieście", "Narutowicza", "Lipowa", "Zamojska", "Lubartowska", "Głęboka", "Unicka", "Filaretów", "Kunickiego", "Hutnicza", "Tomasza Zana", "Okopowa", "Grodzka", "Kowalska", "Kapucyńska"],
};

// ── Property types with distribution targets ──
type PropertyType = "apartment" | "house" | "condo" | "townhouse" | "land";

interface PropertyConfig {
  type: PropertyType;
  count: number;
  cities: string[];
  bedroomRange: [number, number];
  bathroomRange: [number, number];
  areaRange: [number, number]; // m²
  priceRange: [number, number]; // PLN
  yearRange: [number, number];
  amenityPool: string[];
  titleTemplates: string[];
  descTemplates: string[];
}

const PROPERTY_CONFIGS: PropertyConfig[] = [
  {
    type: "apartment",
    count: 40,
    cities: ["Warszawa", "Kraków", "Wrocław"],
    bedroomRange: [1, 4],
    bathroomRange: [1, 2],
    areaRange: [25, 120],
    priceRange: [200000, 1500000],
    yearRange: [1970, 2024],
    amenityPool: ["balkon", "winda", "parking", "piwnica", "klimatyzacja", "monitoring", "siłownia", "recepcja", "smart home", "garaż podziemny"],
    titleTemplates: [
      "Mieszkanie {bed}-pokojowe {district}",
      "Przytulne mieszkanie {area} m² {district}",
      "Nowoczesne mieszkanie {district}",
      "Słoneczne {bed}-pokojowe {district}",
      "Mieszkanie z balkonem {district}",
      "Przestronne {bed}-pokojowe na {district}",
      "Komfortowe mieszkanie {area} m² {district}",
      "Mieszkanie w nowym budownictwie {district}",
    ],
    descTemplates: [
      "Przestronne mieszkanie o powierzchni {area} m² w doskonałej lokalizacji. {bed} pokoje, {bath} łazienka. Wysoki standard wykończenia, jasne wnętrza. Budynek z {year} roku. Blisko komunikacji miejskiej i sklepów.",
      "Funkcjonalne mieszkanie {area} m² z nowoczesnym wykończeniem. Salon z aneksem kuchennym, {bed} sypialnie. Rok budowy {year}. Doskonała lokalizacja z dostępem do infrastruktury miejskiej.",
      "Atrakcyjne mieszkanie o metrażu {area} m². {bed} pokoje, kuchnia, {bath} łazienka. Budynek po termomodernizacji. Spokojna okolica z dobrym dojazdem do centrum.",
    ],
  },
  {
    type: "house",
    count: 40,
    cities: ["Gdańsk", "Poznań", "Lublin"],
    bedroomRange: [3, 6],
    bathroomRange: [1, 3],
    areaRange: [100, 350],
    priceRange: [500000, 3500000],
    yearRange: [1980, 2024],
    amenityPool: ["ogród", "garaż", "kominek", "altana", "alarm", "fotowoltaika", "pompa ciepła", "taras", "piwnica", "basen"],
    titleTemplates: [
      "Dom jednorodzinny z ogrodem — {city}",
      "Przestronny dom {area} m² — {city}",
      "Nowoczesny dom {district}",
      "Dom wolnostojący z garażem — {city}",
      "Komfortowy dom rodzinny — {city}",
      "Dom z dużą działką {district}",
      "Energooszczędny dom — {city}",
      "Dom w zabudowie bliźniaczej — {city}",
    ],
    descTemplates: [
      "Przestronny dom jednorodzinny o powierzchni {area} m² na działce. {bed} sypialni, {bath} łazienki. Garaż, ogród. Spokojna okolica, idealna dla rodziny. Rok budowy {year}.",
      "Komfortowy dom wolnostojący {area} m². {bed} pokoi, salon z kominkiem, {bath} łazienki. Nowoczesne ogrzewanie. Działka zagospodarowana, blisko szkoły i przedszkola.",
      "Dom rodzinny {area} m² w atrakcyjnej lokalizacji. {bed} sypialni, przestronna kuchnia, {bath} łazienki. Garaż i ogród. Budynek z {year} roku w bardzo dobrym stanie.",
    ],
  },
  {
    type: "condo",
    count: 40,
    cities: ["Warszawa", "Katowice"],
    bedroomRange: [1, 3],
    bathroomRange: [1, 2],
    areaRange: [30, 100],
    priceRange: [250000, 1200000],
    yearRange: [2005, 2024],
    amenityPool: ["parking", "winda", "ochrona", "recepcja", "siłownia", "plac zabaw", "monitoring", "smart home", "rowerownia", "strefa relaksu"],
    titleTemplates: [
      "Apartament w strzeżonym osiedlu {district}",
      "Luksusowy apartament {area} m² {district}",
      "Apartament z ochroną {district}",
      "Nowoczesny apartament {district}",
      "Apartament premium {area} m² {district}",
      "Apartament w zamkniętym osiedlu {district}",
      "Ekskluzywny apartament {district}",
      "Apartament deweloperski {district}",
    ],
    descTemplates: [
      "Elegancki apartament {area} m² w strzeżonym kompleksie. {bed} pokoje, {bath} łazienka. Wysoki standard wykończenia, recepcja 24/7. Rok budowy {year}. Doskonała lokalizacja.",
      "Nowoczesny apartament o powierzchni {area} m² w zamkniętym osiedlu. {bed} sypialnie, {bath} łazienki. Ochrona, monitoring, siłownia dla mieszkańców. Budynek z {year} roku.",
      "Apartament premium {area} m² z pełnym pakietem udogodnień. {bed} pokoi, {bath} łazienki. Garaż podziemny, recepcja, strefa relaksu. Rok budowy {year}.",
    ],
  },
  {
    type: "townhouse",
    count: 40,
    cities: ["Kraków", "Wrocław", "Łódź"],
    bedroomRange: [2, 5],
    bathroomRange: [1, 3],
    areaRange: [80, 200],
    priceRange: [400000, 2000000],
    yearRange: [1990, 2024],
    amenityPool: ["ogródek", "garaż", "taras", "piwnica", "alarm", "kominek", "parking", "rowerownia", "plac zabaw", "ogrodzenie"],
    titleTemplates: [
      "Szeregowiec z ogródkiem — {city}",
      "Dom w zabudowie szeregowej {area} m² — {city}",
      "Szeregowiec {district}",
      "Nowoczesny szeregowiec — {city}",
      "Dom szeregowy z garażem — {city}",
      "Komfortowy szeregowiec {district}",
      "Szeregowiec w nowym osiedlu — {city}",
      "Dom szeregowy {area} m² {district}",
    ],
    descTemplates: [
      "Dom w zabudowie szeregowej o powierzchni {area} m². {bed} sypialni, {bath} łazienki. Ogródek prywatny, garaż. Spokojna okolica, dobra komunikacja. Rok budowy {year}.",
      "Nowoczesny szeregowiec {area} m² w atrakcyjnej lokalizacji. {bed} pokoi na dwóch kondygnacjach, {bath} łazienki. Taras, ogródek. Budynek z {year} roku.",
      "Funkcjonalny dom szeregowy {area} m². {bed} sypialni, salon z kuchnią, {bath} łazienki. Garaż i prywatny ogródek. Cicha, zielona okolica. Rok budowy {year}.",
    ],
  },
  {
    type: "land",
    count: 40,
    cities: ["Warszawa", "Kraków", "Wrocław", "Gdańsk", "Poznań", "Łódź", "Katowice", "Lublin"],
    bedroomRange: [0, 0],
    bathroomRange: [0, 0],
    areaRange: [500, 5000], // m² for land plots
    priceRange: [150000, 2000000],
    yearRange: [2020, 2024], // year of subdivision/MPZP
    amenityPool: ["media w drodze", "prąd", "woda", "gaz", "kanalizacja", "droga utwardzona", "MPZP", "ogrodzenie", "studnia", "las w pobliżu"],
    titleTemplates: [
      "Działka budowlana {area} m² — {city}",
      "Działka pod zabudowę {district}",
      "Atrakcyjna działka {area} m² — {city}",
      "Działka z mediami — {city}",
      "Działka inwestycyjna {area} m² — {city}",
      "Działka w planie zagospodarowania — {city}",
      "Działka budowlana z MPZP — {city}",
      "Działka na obrzeżach {city}",
    ],
    descTemplates: [
      "Działka budowlana o powierzchni {area} m² w atrakcyjnej lokalizacji. Media w zasięgu: prąd, woda, gaz. Teren płaski, regularny kształt. Dojazd drogą utwardzoną.",
      "Atrakcyjna działka {area} m² pod zabudowę jednorodzinną. Objęta miejscowym planem zagospodarowania przestrzennego. Media w drodze. Spokojna okolica z dostępem do infrastruktury.",
      "Działka inwestycyjna {area} m² z pełnymi mediami. Teren uzbrojony, gotowy pod budowę. Dobry dojazd, okolica z zabudową jednorodzinną. Blisko sklepów i szkół.",
    ],
  },
];

const DISTRICTS: Record<string, string[]> = {
  Warszawa: ["na Mokotowie", "na Woli", "w Śródmieściu", "na Żoliborzu", "na Pradze", "na Ursynowie", "na Bemowie", "na Bielanach", "na Ochocie", "w Wilanowie"],
  Kraków: ["na Kazimierzu", "w Podgórzu", "na Krowodrzy", "na Prądniku", "w Nowej Hucie", "na Zabłociu", "w Bronowicach", "na Ruczaju", "w Łagiewnikach", "w Czyżynach"],
  Wrocław: ["na Krzykach", "na Śródmieściu", "na Psim Polu", "na Fabrycznej", "na Ołtaszynie", "na Gaju", "w Leśnicy", "na Biskupinie", "na Nadodrzu", "w Jagodnie"],
  Gdańsk: ["we Wrzeszczu", "w Oliwie", "na Przymorzu", "w Śródmieściu", "na Chełmie", "w Brzeźnie", "na Zaspie", "w Jelitkowie", "na Stogach", "w Letnicy"],
  Poznań: ["na Jeżycach", "na Wildzie", "na Łazarzu", "w Śródmieściu", "na Ratajach", "na Piątkowie", "na Winogradach", "w Strzeszynie", "na Dębcu", "na Starym Mieście"],
  Łódź: ["w Śródmieściu", "na Bałutach", "na Widzewie", "na Polesiu", "na Górnej", "na Teofilowie", "na Retkinii", "na Radogoszczu", "na Chojnach", "na Julianowie"],
  Katowice: ["w Śródmieściu", "w Ligocie", "na Brynowie", "w Bogucicach", "na Koszutce", "w Załężu", "w Piotrowicach", "na Ochojcu", "w Dąbrówce", "w Nikiszowcu"],
  Lublin: ["na Starym Mieście", "na Śródmieściu", "na Czechowie", "na Kalinowszczyźnie", "w Dziesiątej", "na Czubach", "w Bronowicach", "na Felin", "na Sławinie", "na Wieniawie"],
};

// ── Seeded PRNG (deterministic so re-runs produce the same slugs) ──
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(42_000);

// ── Helpers ──
function randInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 4): number {
  return parseFloat((rng() * (max - min) + min).toFixed(decimals));
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, n);
}

function makeSlug(title: string, index: number): string {
  const base = slugify(title, { lower: true, strict: true });
  // Append index to guarantee uniqueness across all 200 listings
  return `${base}-${index}`;
}

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

// ── Generate listings data ──
function generateListings(): Array<{
  title: string;
  slug: string;
  description: string;
  propertyType: PropertyType;
  priceCents: bigint;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  yearBuilt: number;
  amenities: string;
  status: string;
}> {
  const listings: ReturnType<typeof generateListings> = [];
  let globalIndex = 0;

  for (const config of PROPERTY_CONFIGS) {
    for (let i = 0; i < config.count; i++) {
      const cityName = config.cities[i % config.cities.length];
      const cityData = CITIES.find((c) => c.city === cityName)!;
      const streets = STREETS[cityName];
      const districts = DISTRICTS[cityName];

      const bed = randInt(config.bedroomRange[0], config.bedroomRange[1]);
      const bath = randInt(config.bathroomRange[0], config.bathroomRange[1]);
      const area = randInt(config.areaRange[0], config.areaRange[1]);
      const price = Math.round(randInt(config.priceRange[0], config.priceRange[1]) / 1000) * 1000;
      const year = randInt(config.yearRange[0], config.yearRange[1]);
      const district = pick(districts);
      const street = pick(streets);
      const streetNum = randInt(1, 150);
      const zip = pick(cityData.zips);
      const amenities = pickN(config.amenityPool, randInt(2, 5));

      const vars = { bed, bath, area, year, city: cityName, district };
      const title = fillTemplate(pick(config.titleTemplates), vars);
      const description = fillTemplate(pick(config.descTemplates), vars);
      const slug = makeSlug(title, globalIndex);

      // Add slight coordinate variation so pins don't stack
      const lat = randFloat(cityData.lat - 0.05, cityData.lat + 0.05);
      const lng = randFloat(cityData.lng - 0.05, cityData.lng + 0.05);

      listings.push({
        title,
        slug,
        description,
        propertyType: config.type,
        priceCents: BigInt(price * 100),
        bedrooms: bed,
        bathrooms: bath,
        areaSqft: area,
        address: `ul. ${street} ${streetNum}`,
        city: cityName,
        state: cityData.state,
        zip,
        latitude: lat,
        longitude: lng,
        yearBuilt: year,
        amenities: JSON.stringify(amenities),
        status: "active",
      });

      globalIndex++;
    }
  }

  return listings;
}

// ── Main ──
async function main() {
  console.log("PropView: seeding data (idempotent)...");

  const passwordHash = await bcrypt.hash("Demo123!", 12);

  // ── Upsert 5 Agents ──
  const agentData = [
    { email: "jan.kowalski@propview.pl", name: "Jan Kowalski", phone: "+48 601 234 567", agencyName: "Kowalski Nieruchomości", bio: "Doświadczony agent z 15-letnim stażem na rynku warszawskim. Specjalizuję się w apartamentach premium i loftach w centrum miasta.", avatarUrl: "/placeholder-avatar-1.jpg" },
    { email: "maria.nowak@propview.pl", name: "Maria Nowak", phone: "+48 602 345 678", agencyName: "Nowak & Partners", bio: "Specjalistka od nieruchomości komercyjnych i lokali użytkowych. Doradzam firmom w Krakowie i okolicach.", avatarUrl: "/placeholder-avatar-2.jpg" },
    { email: "tomasz.wisniewski@propview.pl", name: "Tomasz Wiśniewski", phone: "+48 603 456 789", agencyName: "Dream Home Wrocław", bio: "Agent specjalizujący się w domach jednorodzinnych i nieruchomościach podmiejskich we Wrocławiu.", avatarUrl: "/placeholder-avatar-3.jpg" },
    { email: "anna.zielinska@propview.pl", name: "Anna Zielińska", phone: "+48 604 567 890", agencyName: "Baltic Property Group", bio: "Ekspertka rynku trójmiejskiego. Specjalizuję się w nieruchomościach nadmorskich i apartamentach inwestycyjnych.", avatarUrl: "/placeholder-avatar-4.jpg" },
    { email: "piotr.dabrowski@propview.pl", name: "Piotr Dąbrowski", phone: "+48 605 678 901", agencyName: "City Living Poznań", bio: "Młody, dynamiczny agent pomagający klientom znajdować mieszkania w nowych inwestycjach deweloperskich w Poznaniu.", avatarUrl: "/placeholder-avatar-5.jpg" },
  ];

  const agents = await Promise.all(
    agentData.map((a) =>
      prisma.agent.upsert({
        where: { email: a.email },
        update: { name: a.name, phone: a.phone, agencyName: a.agencyName, bio: a.bio, avatarUrl: a.avatarUrl },
        create: { ...a, passwordHash },
      })
    )
  );
  console.log(`  ✓ ${agents.length} agents upserted`);

  // ── Check existing seed listings to make idempotent ──
  const existingSlugs = new Set(
    (await prisma.listing.findMany({ select: { slug: true } })).map((l) => l.slug)
  );
  console.log(`  ℹ ${existingSlugs.size} existing listings found`);

  // ── Generate and insert 200 listings ──
  const listingsData = generateListings();

  // Filter out listings whose slugs already exist
  const newListings = listingsData.filter((l) => !existingSlugs.has(l.slug));
  console.log(`  ℹ ${newListings.length} new listings to insert`);

  if (newListings.length > 0) {
    // Insert in batches of 50
    const BATCH_SIZE = 50;
    let inserted = 0;
    for (let i = 0; i < newListings.length; i += BATCH_SIZE) {
      const batch = newListings.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((listing, batchIdx) =>
          prisma.listing.create({
            data: {
              agentId: agents[(i + batchIdx) % agents.length].id,
              title: listing.title,
              slug: listing.slug,
              description: listing.description,
              propertyType: listing.propertyType,
              status: listing.status,
              priceCents: listing.priceCents,
              bedrooms: listing.bedrooms,
              bathrooms: listing.bathrooms,
              areaSqft: listing.areaSqft,
              address: listing.address,
              city: listing.city,
              state: listing.state,
              zip: listing.zip,
              latitude: listing.latitude,
              longitude: listing.longitude,
              yearBuilt: listing.yearBuilt,
              amenities: listing.amenities,
            },
          })
        )
      );
      inserted += batch.length;
      console.log(`  ✓ Inserted batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(newListings.length / BATCH_SIZE)} (${inserted} listings)`);
    }
  }

  // ── Seed inquiries (idempotent: skip if any inquiries already exist) ──
  const inquiryCount = await prisma.inquiry.count();
  if (inquiryCount === 0) {
    const allListings = await prisma.listing.findMany({ take: 10, select: { id: true } });
    const inquiryData = [
      { listingIdx: 0, agentIdx: 0, name: "Paweł Malinowski", email: "p.malinowski@gmail.com", phone: "+48 600 111 222", message: "Dzień dobry, jestem zainteresowany tą nieruchomością. Czy możliwe jest umówienie się na prezentację w tym tygodniu?", isRead: true },
      { listingIdx: 1, agentIdx: 1, name: "Dorota Sikora", email: "d.sikora@wp.pl", phone: "+48 600 222 333", message: "Witam, szukam nieruchomości w tej okolicy. Czy cena jest negocjowalna? Jaki jest czynsz administracyjny?", isRead: true },
      { listingIdx: 2, agentIdx: 2, name: "Krzysztof Baran", email: "k.baran@onet.pl", phone: "+48 600 333 444", message: "Szukam nieruchomości dla rodziny z dziećmi. Proszę o więcej informacji.", isRead: false },
      { listingIdx: 3, agentIdx: 1, name: "Izabela Kozłowska", email: "i.kozlowska@firma.pl", phone: "+48 600 444 555", message: "Rozważamy tę nieruchomość. Czy jest możliwość negocjacji i prezentacji?", isRead: true },
      { listingIdx: 4, agentIdx: 3, name: "Maciej Stępień", email: "m.stepien@gmail.com", phone: "+48 600 555 666", message: "Interesuje mnie ta oferta. Czy jest dostępna? Proszę o kontakt.", isRead: false },
      { listingIdx: 5, agentIdx: 0, name: "Katarzyna Wójcik", email: "k.wojcik@outlook.com", phone: "+48 600 666 777", message: "Dzień dobry, jestem zainteresowana. Czy możliwy jest rabat?", isRead: true },
      { listingIdx: 6, agentIdx: 4, name: "Robert Janeczek", email: "r.janeczek@gmail.com", phone: "+48 600 777 888", message: "Planuję zakup. Czy jest możliwość negocjacji ceny?", isRead: false },
      { listingIdx: 7, agentIdx: 2, name: "Sylwia Kaczmarek", email: "s.kaczmarek@wp.pl", phone: "+48 600 888 999", message: "Szukam nieruchomości w tej lokalizacji. Jakie są koszty eksploatacji?", isRead: true },
    ];

    for (const inq of inquiryData) {
      if (allListings[inq.listingIdx]) {
        await prisma.inquiry.create({
          data: {
            listingId: allListings[inq.listingIdx].id,
            agentId: agents[inq.agentIdx].id,
            name: inq.name,
            email: inq.email,
            phone: inq.phone,
            message: inq.message,
            isRead: inq.isRead,
          },
        });
      }
    }
    console.log(`  ✓ ${inquiryData.length} inquiries created`);
  } else {
    console.log(`  ℹ Inquiries already exist (${inquiryCount}), skipping`);
  }

  // ── Final count ──
  const totalListings = await prisma.listing.count({ where: { status: "active" } });
  const totalAgents = await prisma.agent.count();
  console.log(`\nPropView: seed complete!`);
  console.log(`  - ${totalAgents} agents`);
  console.log(`  - ${totalListings} active listings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
