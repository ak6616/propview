import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("PropView: seeding data...");

  const passwordHash = await bcrypt.hash("Demo123!", 12);

  // ── 5 Agents ──
  const agents = await Promise.all([
    prisma.agent.create({
      data: {
        email: "jan.kowalski@propview.pl",
        passwordHash,
        name: "Jan Kowalski",
        phone: "+48 601 234 567",
        agencyName: "Kowalski Nieruchomości",
        bio: "Doświadczony agent z 15-letnim stażem na rynku warszawskim. Specjalizuję się w apartamentach premium i loftach w centrum miasta. Ponad 200 zakończonych transakcji.",
        avatarUrl: "/placeholder-avatar-1.jpg",
      },
    }),
    prisma.agent.create({
      data: {
        email: "maria.nowak@propview.pl",
        passwordHash,
        name: "Maria Nowak",
        phone: "+48 602 345 678",
        agencyName: "Nowak & Partners",
        bio: "Specjalistka od nieruchomości komercyjnych i lokali użytkowych. Doradzam firmom w wyborze idealnej lokalizacji na biuro lub punkt usługowy w Krakowie i okolicach.",
        avatarUrl: "/placeholder-avatar-2.jpg",
      },
    }),
    prisma.agent.create({
      data: {
        email: "tomasz.wisniewski@propview.pl",
        passwordHash,
        name: "Tomasz Wiśniewski",
        phone: "+48 603 456 789",
        agencyName: "Dream Home Wrocław",
        bio: "Agent specjalizujący się w domach jednorodzinnych i nieruchomościach podmiejskich. Pomagam rodzinom znaleźć wymarzone domy na obrzeżach Wrocławia.",
        avatarUrl: "/placeholder-avatar-3.jpg",
      },
    }),
    prisma.agent.create({
      data: {
        email: "anna.zielinska@propview.pl",
        passwordHash,
        name: "Anna Zielińska",
        phone: "+48 604 567 890",
        agencyName: "Baltic Property Group",
        bio: "Ekspertka rynku trójmiejskiego. Specjalizuję się w nieruchomościach nadmorskich i apartamentach inwestycyjnych w Gdańsku, Sopocie i Gdyni.",
        avatarUrl: "/placeholder-avatar-4.jpg",
      },
    }),
    prisma.agent.create({
      data: {
        email: "piotr.dabrowski@propview.pl",
        passwordHash,
        name: "Piotr Dąbrowski",
        phone: "+48 605 678 901",
        agencyName: "City Living Poznań",
        bio: "Młody, dynamiczny agent z pasją do nowoczesnej architektury. Pomagam klientom znajdować mieszkania w nowych inwestycjach deweloperskich w Poznaniu.",
        avatarUrl: "/placeholder-avatar-5.jpg",
      },
    }),
  ]);

  // ── 12 Listings (mix: mieszkania, domy, lokale użytkowe / sprzedaż i wynajem) ──
  const listings = await Promise.all([
    // Mieszkania na sprzedaż
    prisma.listing.create({
      data: {
        agentId: agents[0].id,
        title: "Stylowe mieszkanie 3-pokojowe na Mokotowie",
        slug: "stylowe-3-pokojowe-mokotow",
        description: "Przestronne mieszkanie o powierzchni 72 m² w prestiżowej lokalizacji na Mokotowie. Wysoki standard wykończenia, parkiet dębowy, duży balkon z widokiem na park. Budynek z windą, podziemny garaż w cenie. Blisko metra Wilanowska.",
        propertyType: "apartment",
        status: "active",
        priceCents: 65000000, // 650 000 PLN
        bedrooms: 3,
        bathrooms: 1,
        areaSqft: 775, // ~72 m²
        address: "ul. Puławska 142",
        city: "Warszawa",
        state: "mazowieckie",
        zip: "02-624",
        latitude: 52.1924,
        longitude: 21.0038,
        yearBuilt: 2019,
        amenities: JSON.stringify(["winda", "garaż podziemny", "balkon", "monitoring"]),
        photos: {
          create: [
            { url: "/placeholder-listing-1a.jpg", altText: "Salon z widokiem na park", sortOrder: 0, isPrimary: true },
            { url: "/placeholder-listing-1b.jpg", altText: "Kuchnia otwarta", sortOrder: 1 },
            { url: "/placeholder-listing-1c.jpg", altText: "Sypialnia główna", sortOrder: 2 },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        agentId: agents[0].id,
        title: "Kawalerka inwestycyjna na Woli",
        slug: "kawalerka-inwestycyjna-wola",
        description: "Kompaktowa kawalerka 28 m² w nowym budownictwie na Woli. Idealna pod wynajem krótkoterminowy. Aneks kuchenny, łazienka z prysznicem, smart home. ROI szacowane na 7% rocznie.",
        propertyType: "apartment",
        status: "active",
        priceCents: 38500000, // 385 000 PLN
        bedrooms: 1,
        bathrooms: 1,
        areaSqft: 301, // ~28 m²
        address: "ul. Kasprzaka 31",
        city: "Warszawa",
        state: "mazowieckie",
        zip: "01-234",
        latitude: 52.2340,
        longitude: 20.9710,
        yearBuilt: 2023,
        amenities: JSON.stringify(["smart home", "recepcja", "siłownia", "pralnia"]),
        photos: {
          create: [
            { url: "/placeholder-listing-2a.jpg", altText: "Widok ogólny", sortOrder: 0, isPrimary: true },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        agentId: agents[3].id,
        title: "Apartament z widokiem na morze w Sopocie",
        slug: "apartament-widok-morze-sopot",
        description: "Luksusowy apartament 85 m² z panoramicznym widokiem na Zatokę Gdańską. Taras 15 m², 2 sypialnie, salon z kominkiem. 200 m od plaży. Wysoki standard — marmurowa łazienka, kuchnia Siemens.",
        propertyType: "apartment",
        status: "active",
        priceCents: 79500000, // 795 000 PLN
        bedrooms: 2,
        bathrooms: 2,
        areaSqft: 915, // ~85 m²
        address: "ul. Bohaterów Monte Cassino 28",
        city: "Sopot",
        state: "pomorskie",
        zip: "81-759",
        latitude: 54.4416,
        longitude: 18.5601,
        yearBuilt: 2021,
        amenities: JSON.stringify(["taras", "kominek", "widok na morze", "garaż", "winda"]),
        photos: {
          create: [
            { url: "/placeholder-listing-3a.jpg", altText: "Widok na morze z tarasu", sortOrder: 0, isPrimary: true },
            { url: "/placeholder-listing-3b.jpg", altText: "Salon z kominkiem", sortOrder: 1 },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        agentId: agents[4].id,
        title: "Nowoczesne mieszkanie 2-pokojowe na Jeżycach",
        slug: "nowoczesne-2-pokojowe-jezyce",
        description: "Mieszkanie 48 m² w zrewitalizowanej kamienicy na Jeżycach. Wysoki sufit 3,2 m, ceglane ściany, nowoczesna kuchnia. Idealnie skomunikowane — tramwaj pod domem, 10 min do Starego Rynku.",
        propertyType: "apartment",
        status: "active",
        priceCents: 42000000, // 420 000 PLN
        bedrooms: 2,
        bathrooms: 1,
        areaSqft: 517, // ~48 m²
        address: "ul. Dąbrowskiego 57",
        city: "Poznań",
        state: "wielkopolskie",
        zip: "60-529",
        latitude: 52.4140,
        longitude: 16.9090,
        yearBuilt: 1935,
        amenities: JSON.stringify(["piwnica", "podwórko", "ceglane ściany"]),
        photos: {
          create: [
            { url: "/placeholder-listing-4a.jpg", altText: "Salon z ceglaną ścianą", sortOrder: 0, isPrimary: true },
          ],
        },
      },
    }),
    // Domy na sprzedaż
    prisma.listing.create({
      data: {
        agentId: agents[2].id,
        title: "Dom jednorodzinny z ogrodem — Wrocław Krzyki",
        slug: "dom-ogrod-wroclaw-krzyki",
        description: "Przestronny dom 145 m² na działce 500 m² w spokojnej okolicy Krzyków. 4 sypialnie, 2 łazienki, salon z kominkiem, garaż dwustanowiskowy. Ogród z tarasem i altaną. Szkoła i przedszkole w zasięgu pieszo.",
        propertyType: "house",
        status: "active",
        priceCents: 119000000, // 1 190 000 PLN (dom — wyższy przedział)
        bedrooms: 4,
        bathrooms: 2,
        areaSqft: 1561, // ~145 m²
        address: "ul. Ślężna 83",
        city: "Wrocław",
        state: "dolnośląskie",
        zip: "53-108",
        latitude: 51.0827,
        longitude: 17.0205,
        yearBuilt: 2015,
        amenities: JSON.stringify(["ogród", "garaż", "kominek", "altana", "alarm"]),
        photos: {
          create: [
            { url: "/placeholder-listing-5a.jpg", altText: "Fasada domu", sortOrder: 0, isPrimary: true },
            { url: "/placeholder-listing-5b.jpg", altText: "Ogród z altaną", sortOrder: 1 },
            { url: "/placeholder-listing-5c.jpg", altText: "Salon z kominkiem", sortOrder: 2 },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        agentId: agents[2].id,
        title: "Nowoczesny dom pod Wrocławiem — Siechnice",
        slug: "nowoczesny-dom-siechnice",
        description: "Dom w zabudowie bliźniaczej, 120 m² na działce 350 m². Energooszczędny (klasa A), pompa ciepła, fotowoltaika 8 kW. 3 sypialnie, 2 łazienki, otwarta strefa dzienna. 15 min do centrum Wrocławia.",
        propertyType: "house",
        status: "active",
        priceCents: 78000000, // 780 000 PLN
        bedrooms: 3,
        bathrooms: 2,
        areaSqft: 1292, // ~120 m²
        address: "ul. Ogrodowa 12",
        city: "Siechnice",
        state: "dolnośląskie",
        zip: "55-011",
        latitude: 51.0328,
        longitude: 17.0919,
        yearBuilt: 2024,
        amenities: JSON.stringify(["fotowoltaika", "pompa ciepła", "ogród", "garaż"]),
        photos: {
          create: [
            { url: "/placeholder-listing-6a.jpg", altText: "Widok z zewnątrz", sortOrder: 0, isPrimary: true },
          ],
        },
      },
    }),
    // Lokale użytkowe na sprzedaż
    prisma.listing.create({
      data: {
        agentId: agents[1].id,
        title: "Lokal usługowy w centrum Krakowa",
        slug: "lokal-uslugowy-centrum-krakow",
        description: "Lokal 95 m² na parterze kamienicy przy ul. Karmelickiej. Witryna 6 m, idealne na biuro, gabinet lub showroom. Wysoki standard, klimatyzacja, instalacja IT. Duży ruch pieszy.",
        propertyType: "commercial",
        status: "active",
        priceCents: 85000000, // 850 000 PLN
        bedrooms: 0,
        bathrooms: 1,
        areaSqft: 1023, // ~95 m²
        address: "ul. Karmelicka 27",
        city: "Kraków",
        state: "małopolskie",
        zip: "31-131",
        latitude: 50.0647,
        longitude: 19.9302,
        yearBuilt: 1920,
        amenities: JSON.stringify(["klimatyzacja", "witryna", "zaplecze socjalne"]),
        photos: {
          create: [
            { url: "/placeholder-listing-7a.jpg", altText: "Witryna lokalu", sortOrder: 0, isPrimary: true },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        agentId: agents[1].id,
        title: "Biuro coworkingowe na Kazimierzu",
        slug: "biuro-coworking-kazimierz",
        description: "Klimatyczny lokal biurowy 60 m² w artystycznej dzielnicy Kazimierz. Ceglane ściany, duże okna, patio. Idealne na studio kreatywne lub małą agencję. Meble w cenie.",
        propertyType: "commercial",
        status: "pending",
        priceCents: 55000000, // 550 000 PLN
        bedrooms: 0,
        bathrooms: 1,
        areaSqft: 646, // ~60 m²
        address: "ul. Józefa 18",
        city: "Kraków",
        state: "małopolskie",
        zip: "31-056",
        latitude: 50.0512,
        longitude: 19.9443,
        yearBuilt: 1890,
        amenities: JSON.stringify(["patio", "meble w cenie", "ceglane ściany"]),
        photos: {
          create: [
            { url: "/placeholder-listing-8a.jpg", altText: "Wnętrze biura", sortOrder: 0, isPrimary: true },
          ],
        },
      },
    }),
    // Mieszkania na wynajem
    prisma.listing.create({
      data: {
        agentId: agents[3].id,
        title: "Mieszkanie na wynajem — Gdańsk Wrzeszcz",
        slug: "wynajem-gdansk-wrzeszcz",
        description: "Umeblowane mieszkanie 55 m², 2 pokoje. Nowe budownictwo, pralka, zmywarka, miejsce parkingowe. Blisko PKM Wrzeszcz. Czynsz 3 200 PLN/mc + media. Kaucja: 2 mc.",
        propertyType: "apartment",
        status: "active",
        priceCents: 320000, // 3 200 PLN/mc
        bedrooms: 2,
        bathrooms: 1,
        areaSqft: 592, // ~55 m²
        address: "ul. Partyzantów 76",
        city: "Gdańsk",
        state: "pomorskie",
        zip: "80-254",
        latitude: 54.3800,
        longitude: 18.6070,
        yearBuilt: 2022,
        amenities: JSON.stringify(["umeblowane", "parking", "pralka", "zmywarka"]),
        photos: {
          create: [
            { url: "/placeholder-listing-9a.jpg", altText: "Salon", sortOrder: 0, isPrimary: true },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        agentId: agents[0].id,
        title: "Luksusowy penthouse na wynajem — Śródmieście",
        slug: "penthouse-wynajem-srodmiescie",
        description: "Ekskluzywny penthouse 110 m² na ostatnim piętrze z panoramą Warszawy. 3 pokoje, 2 łazienki, taras 40 m². Garaż podziemny, portier 24/7. Czynsz 8 500 PLN/mc.",
        propertyType: "apartment",
        status: "active",
        priceCents: 850000, // 8 500 PLN/mc
        bedrooms: 3,
        bathrooms: 2,
        areaSqft: 1184, // ~110 m²
        address: "ul. Złota 44",
        city: "Warszawa",
        state: "mazowieckie",
        zip: "00-120",
        latitude: 52.2297,
        longitude: 21.0049,
        yearBuilt: 2017,
        amenities: JSON.stringify(["taras", "portier", "garaż", "siłownia", "basen"]),
        photos: {
          create: [
            { url: "/placeholder-listing-10a.jpg", altText: "Panorama z tarasu", sortOrder: 0, isPrimary: true },
            { url: "/placeholder-listing-10b.jpg", altText: "Salon", sortOrder: 1 },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        agentId: agents[4].id,
        title: "Kawalerka na wynajem — Poznań Centrum",
        slug: "kawalerka-wynajem-poznan",
        description: "Przytulna kawalerka 30 m² w centrum Poznania. Umeblowana, po remoncie. Kuchnia z pełnym wyposażeniem. Czynsz 2 400 PLN/mc + media. Idealna dla singla lub pary.",
        propertyType: "apartment",
        status: "active",
        priceCents: 240000, // 2 400 PLN/mc
        bedrooms: 1,
        bathrooms: 1,
        areaSqft: 323, // ~30 m²
        address: "ul. Św. Marcin 66",
        city: "Poznań",
        state: "wielkopolskie",
        zip: "61-807",
        latitude: 52.4060,
        longitude: 16.9200,
        yearBuilt: 2005,
        amenities: JSON.stringify(["umeblowane", "po remoncie", "internet"]),
        photos: {
          create: [
            { url: "/placeholder-listing-11a.jpg", altText: "Wnętrze kawalerki", sortOrder: 0, isPrimary: true },
          ],
        },
      },
    }),
    // Dom na wynajem
    prisma.listing.create({
      data: {
        agentId: agents[2].id,
        title: "Dom na wynajem z ogrodem — Wrocław Fabryczna",
        slug: "dom-wynajem-wroclaw-fabryczna",
        description: "Wygodny dom 130 m² na wynajem. 4 sypialnie, garaż, ogród 400 m². Cicha, zielona okolica. Czynsz 5 000 PLN/mc. Idealne dla rodziny z dziećmi. Szkoła i sklepy w pobliżu.",
        propertyType: "house",
        status: "active",
        priceCents: 500000, // 5 000 PLN/mc
        bedrooms: 4,
        bathrooms: 2,
        areaSqft: 1399, // ~130 m²
        address: "ul. Grabiszyńska 200",
        city: "Wrocław",
        state: "dolnośląskie",
        zip: "53-235",
        latitude: 51.0940,
        longitude: 16.9850,
        yearBuilt: 2018,
        amenities: JSON.stringify(["ogród", "garaż", "piwnica", "alarm"]),
        photos: {
          create: [
            { url: "/placeholder-listing-12a.jpg", altText: "Widok z zewnątrz", sortOrder: 0, isPrimary: true },
          ],
        },
      },
    }),
  ]);

  // ── 8 Inquiries ──
  const inquiryData = [
    { listingIdx: 0, agentIdx: 0, name: "Paweł Malinowski", email: "p.malinowski@gmail.com", phone: "+48 600 111 222", message: "Dzień dobry, jestem zainteresowany tym mieszkaniem. Czy możliwe jest umówienie się na prezentację w tym tygodniu? Interesuje mnie też stan prawny nieruchomości.", isRead: true },
    { listingIdx: 2, agentIdx: 3, name: "Dorota Sikora", email: "d.sikora@wp.pl", phone: "+48 600 222 333", message: "Witam, szukam apartamentu wakacyjnego w Sopocie. Czy cena jest negocjowalna? Jaki jest czynsz administracyjny?", isRead: true },
    { listingIdx: 4, agentIdx: 2, name: "Krzysztof Baran", email: "k.baran@onet.pl", phone: "+48 600 333 444", message: "Szukam domu dla rodziny z dwójką dzieci. Czy działka jest ogrodzona? Jaki jest koszt ogrzewania?", isRead: false },
    { listingIdx: 6, agentIdx: 1, name: "Izabela Kozłowska", email: "i.kozlowska@firma.pl", phone: "+48 600 444 555", message: "Rozważamy ten lokal na siedzibę naszej firmy doradczej. Czy jest możliwość adaptacji wnętrza? Czy parking jest dostępny w pobliżu?", isRead: true },
    { listingIdx: 8, agentIdx: 3, name: "Maciej Stępień", email: "m.stepien@gmail.com", phone: "+48 600 555 666", message: "Interesuje mnie wynajem od 1 lipca. Czy jest dostępne w tym terminie? Czy akceptują Państwo zwierzęta?", isRead: false },
    { listingIdx: 9, agentIdx: 0, name: "Katarzyna Wójcik", email: "k.wojcik@outlook.com", phone: "+48 600 666 777", message: "Dzień dobry, jestem zainteresowana wynajmem penthouse'u na okres 12 miesięcy. Czy możliwy jest rabat przy dłuższym kontrakcie?", isRead: true },
    { listingIdx: 3, agentIdx: 4, name: "Robert Janeczek", email: "r.janeczek@gmail.com", phone: "+48 600 777 888", message: "Planuję zakup mieszkania na Jeżycach. Czy jest możliwość negocjacji ceny? Kiedy mogę obejrzeć nieruchomość?", isRead: false },
    { listingIdx: 5, agentIdx: 2, name: "Sylwia Kaczmarek", email: "s.kaczmarek@wp.pl", phone: "+48 600 888 999", message: "Szukam domu energooszczędnego pod Wrocławiem. Jakie są koszty eksploatacji z fotowoltaiką? Czy jest pompa ciepła?", isRead: true },
  ];

  for (const inq of inquiryData) {
    await prisma.inquiry.create({
      data: {
        listingId: listings[inq.listingIdx].id,
        agentId: agents[inq.agentIdx].id,
        name: inq.name,
        email: inq.email,
        phone: inq.phone,
        message: inq.message,
        isRead: inq.isRead,
      },
    });
  }

  console.log("PropView: seed complete!");
  console.log(`  - ${agents.length} agentów nieruchomości`);
  console.log(`  - ${listings.length} ogłoszeń (mieszkania, domy, lokale)`);
  console.log(`  - Zdjęcia placeholder dla każdego ogłoszenia`);
  console.log(`  - ${inquiryData.length} zapytań kontaktowych`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
