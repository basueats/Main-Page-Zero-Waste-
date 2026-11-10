import { InventoryItem, CommunityDonationAlert, UpcycledRecipe, TrainingCourse, PartnerShelter, PricingPlan } from '../types';

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Day-Old Sourdough & Focaccia Loaves',
    category: 'Bakery & Grains',
    quantity: 18.5,
    unit: 'kg',
    station: 'Pastry & Bakery',
    storage: 'Ambient Dry Store',
    dateLogged: 'Today, 06:30 AM',
    shelfLifeHoursRemaining: 8,
    status: 'zero_waste_critical',
    upcyclePotentialRecipeId: 'rec-1',
    estimatedCostValue: 125,
  },
  {
    id: 'inv-2',
    name: 'Brassica & Broccoli Stalk Trimmings',
    category: 'Produce Trimmings',
    quantity: 14.0,
    unit: 'kg',
    station: 'Prep Station',
    storage: 'Walk-in Chiller',
    dateLogged: 'Today, 09:15 AM',
    shelfLifeHoursRemaining: 36,
    status: 'optimal',
    upcyclePotentialRecipeId: 'rec-2',
    estimatedCostValue: 68,
  },
  {
    id: 'inv-3',
    name: 'Over-Prepped Roasted Heirloom Veg & Quinoa',
    category: 'Prepared Mains',
    quantity: 26.0,
    unit: 'portions',
    station: 'Buffet / Banquet',
    storage: 'Blast Chiller',
    dateLogged: 'Today, 02:00 PM',
    shelfLifeHoursRemaining: 14,
    status: 'zero_waste_critical',
    estimatedCostValue: 240,
  },
  {
    id: 'inv-4',
    name: 'Citrus Peels & Lemon Husks (Bar Residuals)',
    category: 'Citrus & Fruits',
    quantity: 9.2,
    unit: 'kg',
    station: 'Cold Larder',
    storage: 'Walk-in Chiller',
    dateLogged: 'Yesterday, 11:45 PM',
    shelfLifeHoursRemaining: 48,
    status: 'optimal',
    upcyclePotentialRecipeId: 'rec-3',
    estimatedCostValue: 45,
  },
  {
    id: 'inv-5',
    name: 'Soft Herb Stems (Coriander, Parsley, Dill)',
    category: 'Herbs & Aromatics',
    quantity: 3.8,
    unit: 'kg',
    station: 'Prep Station',
    storage: 'Walk-in Chiller',
    dateLogged: 'Today, 10:00 AM',
    shelfLifeHoursRemaining: 18,
    status: 'use_soon',
    upcyclePotentialRecipeId: 'rec-4',
    estimatedCostValue: 52,
  },
  {
    id: 'inv-6',
    name: 'Roasted Onion Skins & Allium Outer Layers',
    category: 'Produce Trimmings',
    quantity: 6.5,
    unit: 'kg',
    station: 'Prep Station',
    storage: 'Ambient Dry Store',
    dateLogged: 'Today, 08:00 AM',
    shelfLifeHoursRemaining: 72,
    status: 'optimal',
    upcyclePotentialRecipeId: 'rec-5',
    estimatedCostValue: 30,
  },
  {
    id: 'inv-7',
    name: 'Oat & Soy Milk Steaming Residuals (Barista Batch)',
    category: 'Dairy & Liquids',
    quantity: 12.0,
    unit: 'L',
    station: 'Pastry & Bakery',
    storage: 'Walk-in Chiller',
    dateLogged: 'Today, 11:30 AM',
    shelfLifeHoursRemaining: 12,
    status: 'use_soon',
    upcyclePotentialRecipeId: 'rec-6',
    estimatedCostValue: 38,
  },
  {
    id: 'inv-8',
    name: 'Morning Banquet Pastries & Croissants',
    category: 'Bakery & Grains',
    quantity: 42,
    unit: 'portions',
    station: 'Buffet / Banquet',
    storage: 'Ambient Dry Store',
    dateLogged: 'Today, 11:00 AM',
    shelfLifeHoursRemaining: 6,
    status: 'zero_waste_critical',
    estimatedCostValue: 165,
  }
];

export const INITIAL_DONATION_ALERTS: CommunityDonationAlert[] = [
  {
    id: 'don-101',
    itemTitle: 'Artisan Sourdough & Morning Brioche Batches',
    category: 'Bakery & Grains',
    quantityStr: '18 kg (approx. 45 portions)',
    kitchenLocation: 'Central Culinary Lab - Station 4',
    pickupWindow: 'Today by 05:30 PM (Next 2 Hours)',
    temperatureRequirement: 'Ambient / Room Temp',
    matchedShelterName: 'St. Jude Community Dining Room',
    status: 'in_transit',
    timestamp: '28 mins ago',
    donorChef: 'Cold Larder Station',
    mealsEquivalency: 45,
    dietaryNotes: ['Vegetarian', 'Contains Gluten', 'Zero Additives'],
  },
  {
    id: 'don-102',
    itemTitle: 'Chilled Banquet Mediterranean Grain Bowls & Braised Lentils',
    category: 'Prepared Mains',
    quantityStr: '35 chilled meal packs',
    kitchenLocation: 'Banquet Kitchen Dock B',
    pickupWindow: 'Today by 07:00 PM',
    temperatureRequirement: 'Chilled (<4°C)',
    matchedShelterName: 'Harbor City Food Rescue Coalition',
    status: 'claimed',
    timestamp: '45 mins ago',
    donorChef: 'Hot Line Lead Station',
    mealsEquivalency: 35,
    dietaryNotes: ['Vegan', 'Gluten-Free', 'High Protein', 'Sealed & Date-Stamped'],
  },
  {
    id: 'don-103',
    itemTitle: 'Fresh Whole Market Greens & Uncut Root Vegetables',
    category: 'Produce Trimmings',
    quantityStr: '22 kg in vented crates',
    kitchenLocation: 'Goods Receiving Bay 1',
    pickupWindow: 'Tomorrow morning 08:00 - 10:00 AM',
    temperatureRequirement: 'Chilled (<4°C)',
    matchedShelterName: 'Downtown Youth Nutrition Center',
    status: 'broadcasting',
    timestamp: 'Just now',
    donorChef: 'Central Brigade Station',
    mealsEquivalency: 60,
    dietaryNotes: ['Fresh Organic Produce', 'Uncooked', 'Nutrient Rich'],
  },
  {
    id: 'don-104',
    itemTitle: 'Hearty Tomato & Vegetable Broth Base with White Beans',
    category: 'Prepared Mains',
    quantityStr: '20 Liters in sanitized cambro',
    kitchenLocation: 'Stock & Sauce Station',
    pickupWindow: 'Completed Today 01:15 PM',
    temperatureRequirement: 'Chilled (<4°C)',
    matchedShelterName: 'Eastside Family Shelter',
    status: 'delivered',
    timestamp: '3 hours ago',
    donorChef: 'Pastry & Bakery Station',
    mealsEquivalency: 50,
    dietaryNotes: ['Vegan', 'Nut-Free', 'Low Sodium'],
  }
];

export const UPCYCLED_RECIPES: UpcycledRecipe[] = [
  {
    id: 'rec-1',
    title: 'Stale Sourdough Miso & Toasted Bread Caramel',
    zeroWasteHeroIngredient: 'Day-Old Sourdough / Baguette Crusts',
    category: 'Condiments & Pastes',
    prepTime: '45 mins + 30 days fermentation (optional rapid 2h glaze)',
    difficulty: 'Professional',
    station: 'Pastry & Larder',
    wasteReductionRate: '98% crust conversion',
    costSavingsPerKg: 14.50,
    co2OffsetKg: 2.4,
    description: 'Transform hardened bakery zero waste scraps into an intensely savoury-sweet umami paste. Used by Michelin kitchens to glaze roasted root vegetables, finish dark chocolate desserts, or enrich plant-based gravies.',
    ingredients: [
      { item: 'Stale sourdough bread (heavily toasted at 190°C)', amount: '500g', isZeroWaste: true },
      { item: 'Filtered water (steeped hot)', amount: '800ml' },
      { item: 'Koji rice or organic barley koji', amount: '250g' },
      { item: 'Non-iodized sea salt', amount: '60g' },
      { item: 'Organic cane sugar (for quick caramel variant)', amount: '120g' }
    ],
    steps: [
      'Break rock-hard bread into rough chunks and roast until deep mahogany-brown (almost caramelized) to develop pyrazines.',
      'Soak roasted bread in warm water for 25 minutes, then blend with koji and salt until a smooth, velvety paste forms.',
      'Pack tightly into a sterilized crock, seal with parchment and salt weight, and ferment at 28°C for 28 days for deep depth.',
      'Rapid Kitchen Variant: Simmer roasted bread reduction with 15% sugar and deglaze with apple cider vinegar for an instant savory dessert glaze.'
    ],
    chefTip: 'Never throw away bread heel crusts or dried baguettes. Dehydrated and ground, they also replace 30% of flour in pasta dough for an incredible roasted aroma.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    tags: ['Bakery', 'Fermentation', 'Zero-Waste Dessert', 'Savory Glaze']
  },
  {
    id: 'rec-2',
    title: 'Broccoli Stalk Carpaccio with Preserved Lemon & Herb Oil',
    zeroWasteHeroIngredient: 'Broccoli & Cauliflower Tough Stems',
    category: 'Entrees',
    prepTime: '20 mins',
    difficulty: 'Essential Brigade',
    station: 'Cold Larder',
    wasteReductionRate: '100% stalk utilization',
    costSavingsPerKg: 9.80,
    co2OffsetKg: 1.8,
    description: 'The stems contain higher natural sweetness and crunch than florets, yet 70% of kitchens discard them. Peeled and shaved wafer-thin, they create a crisp, refreshing raw carpaccio.',
    ingredients: [
      { item: 'Broccoli and cauliflower stems (outer woody fiber peeled)', amount: '600g', isZeroWaste: true },
      { item: 'Upcycled citrus peel oil or cold-pressed olive oil', amount: '60ml' },
      { item: 'Preserved lemon rind (finely brunoised)', amount: '30g', isZeroWaste: true },
      { item: 'Toasted sunflower seeds or pine nuts', amount: '40g' },
      { item: 'Maldon flake salt & crushed pink peppercorn', amount: 'To taste' },
      { item: 'Herb stem emulsion or vinaigrette', amount: '45ml' }
    ],
    steps: [
      'Use a sharp peeler or paring knife to remove the tough fibrous outer skin from the stems.',
      'Using a mandoline slicer set to 1mm, slice the sweet tender cores into translucent paper-thin ribbons.',
      'Submerge ribbons in ice-cold filtered water for 10 minutes to crisp up into dramatic architectural curls.',
      'Arrange ribbons across chilled plates, dress generously with citrus oil and herb emulsion, and garnish with seeds and preserved lemon.'
    ],
    chefTip: 'Save the peeled tough fibers for your deep vegetable stock or dehydrate and grind them into a green seasoning salt.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    tags: ['Produce', 'Cold Larder', 'Raw', 'High Margin']
  },
  {
    id: 'rec-3',
    title: 'Zero-Waste Citrus Peel Oleo Saccharum & Cordial',
    zeroWasteHeroIngredient: 'Spent Orange, Lemon & Lime Rinds',
    category: 'Condiments & Pastes',
    prepTime: '15 mins active + 12h cold maceration',
    difficulty: 'Essential Brigade',
    station: 'Pastry / Beverage',
    wasteReductionRate: '92% peel recovery',
    costSavingsPerKg: 18.00,
    co2OffsetKg: 3.1,
    description: 'Commercial bars and pastry sections juice hundreds of lemons and oranges weekly, discarding the aromatic peels. Cold-macerating them with sugar extracts the volatile essential oils without any bitterness.',
    ingredients: [
      { item: 'Juiced citrus husks (lemons, limes, oranges, grapefruit)', amount: '1.0kg', isZeroWaste: true },
      { item: 'Granulated organic cane sugar', amount: '800g' },
      { item: 'Citric or malic acid powder', amount: '25g' },
      { item: 'Spring water', amount: '500ml' }
    ],
    steps: [
      'Slice discarded citrus husks into quarters and toss aggressively with granulated sugar in a large food-grade cambro.',
      'Vacuum-seal the mixture or cover tightly. The hygroscopic sugar draws out essential citrus oils over 12 to 18 hours at room temp.',
      'Strain through a fine chinois. You now have an intense, crystal-clear Oleo Saccharum syrup.',
      'Add spring water and organic citric/malic acid to create a shelf-stable zero-waste cocktail and pastry cordial.'
    ],
    chefTip: 'After pressing the syrup out of the peels, dehydrate the candied peels at 65°C to create candied citrus peel garnish or chocolate coatings.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    tags: ['Bar & Pastry', 'Extraction', 'Citrus', 'High Shelf-Life']
  },
  {
    id: 'rec-4',
    title: 'Herb Stem & Charred Scallion Chimichurri',
    zeroWasteHeroIngredient: 'Herb Stems (Parsley, Cilantro, Oregano, Basil)',
    category: 'Sauces & Stocks',
    prepTime: '15 mins',
    difficulty: 'Essential Brigade',
    station: 'Hot Line / Prep',
    wasteReductionRate: '100% stem rescue',
    costSavingsPerKg: 12.00,
    co2OffsetKg: 1.5,
    description: 'Chefs routinely strip leaves and bin the stems. The stems hold intense aromatic oils and pleasant herbaceous crunch when finely pulsed with vinegar, garlic, and cold-pressed oil.',
    ingredients: [
      { item: 'Mixed fresh herb stems (washed and dry)', amount: '350g', isZeroWaste: true },
      { item: 'Charred scallion greens & shallot trimmings', amount: '150g', isZeroWaste: true },
      { item: 'Raw garlic cloves (confit or fresh)', amount: '4 cloves' },
      { item: 'Red wine vinegar or live apple cider vinegar', amount: '120ml' },
      { item: 'Extra virgin olive oil', amount: '220ml' },
      { item: 'Smoked dried chili flakes & coarse sea salt', amount: 'To taste' }
    ],
    steps: [
      'Blanch soft stems for 4 seconds in boiling salted water and immediately shock in ice bath to fix chlorophyll color.',
      'Dry thoroughly and pulse in a food processor with charred scallions, garlic, and vinegar until finely minced (not puréed).',
      'Fold in the olive oil by hand with smoked chili flakes and salt to retain vibrant texture.',
      'Rest for 2 hours before service. Outstanding as a condiment for grilled oyster mushrooms, roasted squash, or flatbreads.'
    ],
    chefTip: 'For woody rosemary or thyme stems, infuse them directly into warm neutral oil or vinegar instead of pulsing.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tags: ['Herbs', 'Sauces', 'Prep Waste', 'Fast Turnaround']
  },
  {
    id: 'rec-5',
    title: 'Charred Allium Skin Umami Dashi & Glaze',
    zeroWasteHeroIngredient: 'Yellow & Red Onion Skins, Shallot & Leek Tops',
    category: 'Sauces & Stocks',
    prepTime: '2 hours gentle extraction',
    difficulty: 'Intermediate',
    station: 'Stock & Sauce',
    wasteReductionRate: '100% skin conversion',
    costSavingsPerKg: 16.50,
    co2OffsetKg: 2.1,
    description: 'Onion skins contain quercetin, rich natural colorants, and deep woodsy earthiness. Lightly roasting or charring them yields a golden-amber broth with the mouthfeel of roasted poultry stock.',
    ingredients: [
      { item: 'Clean outer onion and shallot skins', amount: '400g', isZeroWaste: true },
      { item: 'Dark green leek tops (well washed)', amount: '500g', isZeroWaste: true },
      { item: 'Dried kombu sheet', amount: '30g' },
      { item: 'Dried shiitake caps & mushroom stems', amount: '60g', isZeroWaste: true },
      { item: 'Filtered water', amount: '4.5 Liters' },
      { item: 'Naturally fermented soy sauce / tamari', amount: '90ml' }
    ],
    steps: [
      'Roast onion skins in a flat gastronorm tray at 200°C for 12-14 minutes until fragrant and deeply darkened.',
      'Char leek tops directly over an open burner flame or under the salamander until blackened at the tips.',
      'Combine skins, leeks, shiitake stems, and kombu in cold water. Bring slowly to 85°C (never a rolling boil) for 90 minutes.',
      'Strain through a fine mesh oil filter. Reduce by 40% for rich consommé, or by 80% with tamari for a glossy, savory kitchen demi-glace.'
    ],
    chefTip: 'This broth has zero fat yet coats the palate luxuriously. Freeze into cubes for instant depth in risottos and pan sauces.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    tags: ['Broth', 'Umami', 'Produce Trims', 'Michelin Technique']
  },
  {
    id: 'rec-6',
    title: 'Silky Plant Milk Ricotta from Barista Steamer Residuals',
    zeroWasteHeroIngredient: 'Residual Soy / Oat Barista Milk',
    category: 'Ferments & Pickles',
    prepTime: '30 mins active + 2h strain',
    difficulty: 'Intermediate',
    station: 'Pastry / Cold Larder',
    wasteReductionRate: '90% liquid recovery',
    costSavingsPerKg: 11.20,
    co2OffsetKg: 2.8,
    description: 'Barista stations discard milk pitch residuals throughout busy shifts. Coagulated with natural acid, high-protein plant milk produces a fluffy, pillowy curd identical to fresh dairy ricotta.',
    ingredients: [
      { item: 'Residual unflavored soy or barista milk', amount: '3.0 Liters', isZeroWaste: true },
      { item: 'Fresh lemon juice or raw apple cider vinegar', amount: '65ml' },
      { item: 'Nutritional yeast flakes', amount: '15g' },
      { item: 'Fine sea salt & cracked white pepper', amount: '8g' },
      { item: 'Cold-pressed extra virgin olive oil', amount: '30ml' }
    ],
    steps: [
      'Heat collected plant milk slowly in a heavy-bottomed pot to 88°C, stirring gently to avoid scorching.',
      'Remove from heat and pour in the acid in a slow spiral. Do not stir vigorously; let curds gently separate for 15 minutes.',
      'Ladle the soft curds into a cheesecloth-lined sieve suspended over a bowl. Let gravity drain for 90 minutes.',
      'Gently fold in salt, nutritional yeast, and olive oil. Store chilled for up to 5 days.'
    ],
    chefTip: 'Save the separated acidic whey liquid! It makes an incredible ferment starter for quick pickles or a tenderizing marinade.',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=800&q=80',
    tags: ['Dairy Alternative', 'Breakfast Residuals', 'Curds', 'Pastry']
  }
];

export const TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'train-1',
    title: 'The Zero-Waste Brigade Bootcamp',
    format: 'Hybrid Masterclass',
    duration: '4 Weeks (Live Chef Mentorship + Kitchen Drills)',
    targetAudience: 'Head Chefs, Sous Chefs, Chef de Parties, Prep Cooks',
    description: 'The premier culinary transformation program developed by master culinary directors. Shifts kitchen psychology from trash-can convenience to culinary upcycling, trimming waste by 30-50% in the first month.',
    modules: [
      {
        title: 'Module 1: The Circular Kitchen Mindset & Bin Audits',
        duration: 'Week 1',
        topics: ['Deconstructing the waste psychology', 'Executing a 48-hour physical bin characterization', 'Identifying high-loss prep stations', 'Financial cost of trim disposal']
      },
      {
        title: 'Module 2: Whole-Produce Gastronomy & Scrap Architecture',
        duration: 'Week 2',
        topics: ['Root-to-leaf and stem mastery', 'Advanced allium, brassica, and peel transformations', 'Dehydration, roasting, and umami powder synthesis', 'Pastry scrap integrations']
      },
      {
        title: 'Module 3: Buffet, Banquet & Overproduction Control',
        duration: 'Week 3',
        topics: ['Dynamic display engineering without volume glut', 'Safe rapid chilling & secondary service lifecycles', 'Banquet bread & starch loops', 'Community rescue dispatch protocols']
      },
      {
        title: 'Module 4: Circular Menu Engineering & KPI Dashboarding',
        duration: 'Week 4',
        topics: ['Designing cross-utilization dish matrices', 'Food cost reduction tracking', 'Staff incentive and compliance systems', 'Digital inventory & donation integration']
      }
    ],
    keyOutcomes: [
      'Average 34% drop in commercial kitchen food waste',
      '4.5% to 7.8% boost in overall gross kitchen margin',
      'Zero Waste Kitchen Certified Brigade Badge',
      'Customized 50-recipe upcycling playbook for your venue'
    ],
    priceNote: 'Flexible enterprise & boutique cohorts',
    highlight: true,
  },
  {
    id: 'train-2',
    title: 'Executive F&B & Buffet Waste Masterclass',
    format: 'Executive F&B Advisory',
    duration: '2-Day Intensive + 30-Day Audit',
    targetAudience: 'F&B Directors, Executive Chefs, Hotel General Managers, Cruise Operations',
    description: 'Engineered specifically for high-volume hospitality, all-inclusive resorts, and conference hotels where buffets account for over 60% of avoidable kitchen waste.',
    modules: [
      {
        title: 'Session 1: High-Volume Overproduction Architecture',
        duration: 'Day 1 Morning',
        topics: ['Live guest flow modeling', 'Plate size psychology and display vessel scaling', 'Batch preparation timing vs holding windows']
      },
      {
        title: 'Session 2: The Secondary Transformation Pipeline',
        duration: 'Day 1 Afternoon',
        topics: ['Same-day safe blast chilling SOPs', 'Repurposing hot-held proteins and roasted produce', 'Breakfast pastry into dessert bases']
      },
      {
        title: 'Session 3: Supply Chain & Donation Dispatch Compliance',
        duration: 'Day 2 Full Day',
        topics: ['Cold-chain food rescue logistics', 'Legal compliance & Good Samaritan liability protection', 'CSR reporting and carbon credits']
      }
    ],
    keyOutcomes: [
      'Eliminate 40%+ of buffet disposal within 60 days',
      'Automated integration with local community shelters',
      'Comprehensive ESG & CSR board audit report'
    ],
    priceNote: 'Tailored for hospitality portfolios',
  },
  {
    id: 'train-3',
    title: 'Upcycled Fermentation & Larder Masterclass',
    format: 'Digital Brigade Certification',
    duration: 'Self-Paced / 12 Masterclass Modules',
    targetAudience: 'Sous Chefs, Pastry Chefs, Bar Managers, Independent Restaurateurs',
    description: 'Master ancient preservation and modern gastronomic techniques: koji, misos, garums, lacto-ferments, vinegars, and fruit syrups derived 100% from kitchen trimmings.',
    modules: [
      {
        title: 'Part 1: Lacto-Fermenting Veg Scraps & Stems',
        duration: 'Modules 1-4',
        topics: ['Salt percentage formulas', 'Brine upcycling', 'Pickled stems & crunchy garnishes']
      },
      {
        title: 'Part 2: Bread Koji & Quick Misos',
        duration: 'Modules 5-8',
        topics: ['Inoculating bread crumbs', 'Rapid 30-day koji paste', 'Umami finishing salts']
      },
      {
        title: 'Part 3: Bar & Pastry Synergy',
        duration: 'Modules 9-12',
        topics: ['Spent citrus peel cordials', 'Coffee ground liqueurs', 'Fruit peel vinegars and shrubbings']
      }
    ],
    keyOutcomes: [
      'Turn zero-cost scrap into premium menu ingredients',
      'Lifetime access to digital recipe updates',
      'Direct monthly executive Q&A sessions'
    ],
    priceNote: 'Instant access for culinary teams',
  }
];

export const PARTNER_SHELTERS: PartnerShelter[] = [
  {
    id: 'sh-1',
    name: 'St. Jude Community Dining Room',
    organizationType: 'Community Kitchen',
    distance: '1.8 km',
    capacityPerDay: '350 hot meals',
    contactPerson: 'Sister Sarah Jenkins (Logistics Coordinator)',
    urgentNeeds: ['Prepared hot or chilled meals', 'Bread & bakery', 'Fresh fruits'],
    pickupAvailability: 'Daily 07:00 AM - 08:30 PM (Volunteer Drivers on Standby)',
    verifiedStatus: true,
  },
  {
    id: 'sh-2',
    name: 'Harbor City Food Rescue Coalition',
    organizationType: 'Food Bank',
    distance: '3.4 km',
    capacityPerDay: '1,200 kg bulk food storage',
    contactPerson: 'David Miller (Cold Chain Director)',
    urgentNeeds: ['Chilled proteins', 'Whole vegetable crates', 'Dairy & plant milks'],
    pickupAvailability: 'Refrigerated van pickups every 2 hours',
    verifiedStatus: true,
  },
  {
    id: 'sh-3',
    name: 'Downtown Youth Nutrition Center',
    organizationType: 'Youth Nutrition Centre',
    distance: '2.1 km',
    capacityPerDay: '200 after-school meals',
    contactPerson: 'Amara Vance (Programs Lead)',
    urgentNeeds: ['Fresh fruit', 'Healthy baked goods', 'Soup bases & pulses'],
    pickupAvailability: 'Mon-Fri 02:00 PM - 06:00 PM',
    verifiedStatus: true,
  },
  {
    id: 'sh-4',
    name: 'Eastside Family Hope Shelter',
    organizationType: 'Emergency Shelter',
    distance: '4.6 km',
    capacityPerDay: '180 residents daily',
    contactPerson: 'Carlos Mendez (Kitchen Supervisor)',
    urgentNeeds: ['Cooked vegetarian dishes', 'Grains & rice', 'Clean packaged breakfast items'],
    pickupAvailability: '24/7 Receiving Dock',
    verifiedStatus: true,
  }
];

export const CLIENT_TESTIMONIALS = [
  {
    quote: "Working with the Zero Waste Kitchen system fundamentally rewired how our 40-chef brigade operates. In our first quarter, food waste dropped by 41% and our bottom line increased by $78,000 without sacrificing our fine dining standards.",
    author: "Executive Culinary Director",
    role: "Culinary Director, Grand Azure Luxury Resort & Spa",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80"
  },
  {
    quote: "The live inventory dashboard and instant donation alerts solved our banquet dilemma. Instead of throwing away untouched conference lunches, our team clicks one button and local shelters pick it up within 45 minutes. It transformed staff morale.",
    author: "F&B Operations Lead",
    role: "F&B Operations Vice President, Continental Hotel Group",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80"
  },
  {
    quote: "Zero Waste: The Food Waste Guide for Chefs is the definitive modern culinary manual. The platform proves that true culinary mastery isn't using expensive truffles—it's having the technique to make onion skins and stale bread taste extraordinary.",
    author: "Culinary Educator",
    role: "Michelin Green Star Awardee & Circular Gastronomy Educator",
    image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=300&q=80"
  }
];

export const BOOK_DETAILS = {
  title: "Zero Waste: The Food Waste Guide for Chefs",
  author: "Zero Waste Culinary Academy",
  pages: 248,
  publisher: "Zero Waste Gastronomy Press",
  isbn: "978-0-6489354-0-7",
  tagline: "The practical manual for commercial kitchens to eliminate waste, cut costs, and revolutionize menu development.",
  description: "Written from firsthand experience after launching the world's first zero-waste vegan restaurant, this book dismantles the myth that food waste is an unavoidable cost of doing business. It provides a complete tactical framework: from shifting brigade habits and executing bin audits to over 60 commercial-yield upcycled recipes and an extensive scrap-ingredient encyclopedia.",
  chapters: [
    { number: '01', title: 'The Psychology of the Rubbish Bin', summary: 'Why commercial kitchens waste 30% of their purchases and how to rewire kitchen brigade instincts.' },
    { number: '02', title: 'The 48-Hour Kitchen Audit', summary: 'How to weigh, categorize, and price every gram of prep, spoilage, and plate waste.' },
    { number: '03', title: 'Root, Stem & Peel Gastronomy', summary: 'Unlocking sugars, pectins, and umami in vegetable trimmings commonly considered inedible.' },
    { number: '04', title: 'The Secondary Life of Starch & Bread', summary: 'Techniques for day-old bakery items: misos, caramels, pasta fillers, and thickeners.' },
    { number: '05', title: 'Buffet & Banquet Engineering', summary: 'Designing display systems that impress guests while cutting overproduction by half.' },
    { number: '06', title: 'The Commercial Upcycling Recipe Directory', summary: '60+ kitchen-tested, high-margin formulas with cost savings and yield conversions.' }
  ]
};

export const FAQ_ITEMS = [
  {
    question: "What exactly is the ZERO WASTE app?",
    answer: "The ZERO WASTE app by Supritamone is an all-in-one digital learning platform and kitchen management tool designed specifically for chefs, kitchen teams, and F&B managers. It provides an ingredient byproduct catalogue, zero-waste recipes, structured mini-courses, and practical templates to eliminate commercial kitchen food waste."
  },
  {
    question: "What is inside ZERO WASTE?",
    answer: "Inside you will find over 60 commercial-yield zero-waste recipes, structured video mini-courses (covering prep waste, buffet waste, and circular menu planning), a searchable byproduct directory, kitchen inventory tracking, printable SOP templates, and an automated community donation alert dispatcher."
  },
  {
    question: "Who is ZERO WASTE for?",
    answer: "ZERO WASTE is engineered for hospitality professionals of all levels: Head Chefs, Sous Chefs, Chef de Parties, F&B Directors, hotel culinary brigades, resort operations, catering managers, culinary educators, and independent restaurateurs looking to protect profit margins."
  },
  {
    question: "Why should I join ZERO WASTE?",
    answer: "Food waste is the single largest controllable variable cost in commercial hospitality, accounting for 6% to 9% of total food spend. Joining gives your culinary brigade the practical systems to eliminate up to 50% of prep trimmings and buffet waste—directly boosting your bottom line and staff morale."
  },
  {
    question: "Is ZERO WASTE useful for every commercial kitchen?",
    answer: "Yes. From Michelin-starred fine dining and boutique farm-to-table bistros to high-volume 5-star hotel buffets and catering operations, the root-to-leaf techniques, storage SOPs, and inventory alert tools are universally applicable."
  },
  {
    question: "Is a team plan available on ZERO WASTE?",
    answer: "Yes! Our Team Plan is designed for kitchen brigades with 5 or more chefs at $79 per chef/year, featuring multi-user access, brigade progress tracking, engagement analytics, and shared kitchen recipe binders."
  },
  {
    question: "How can chefs use the ZERO WASTE app?",
    answer: "Chefs can use it directly on the line via smartphone, tablet, or kitchen monitor: search byproducts in seconds (e.g. what to do with 10kg of leek greens or cauliflower leaves), watch bite-sized video lessons before prep, log station stock, and dispatch zero waste donations to community shelters with a single tap."
  },
  {
    question: "Why is the ZERO WASTE app not free?",
    answer: "We offer a 3-Day Free Trial with 100% full brigade access so every kitchen can test the systems before committing. The platform contains years of proprietary culinary research, commercial audits, and recipes tested across luxury hotel groups. Annual subscriptions cost less than a single bin of discarded kitchen trimmings."
  },
  {
    question: "Will the ZERO WASTE app help me to reduce food waste?",
    answer: "Yes, verified client kitchens audited by our culinary specialists report an average 34% to 50% reduction in avoidable prep and buffet waste within the first two months of consistent use."
  },
  {
    question: "Is the ZERO WASTE app useful for catering operations?",
    answer: "Absolutely. High-volume catering frequently encounters unpredictable guest turnouts and overproduction. The app provides exact batch planning guides, secondary transformation recipes, and cold-chain donation dispatch protocols."
  },
  {
    question: "Can we use the ZERO WASTE app as a training platform for our chefs?",
    answer: "Yes. Leading hotel chains and culinary schools use our structured modules to onboard junior cooks, upskill prep stations, and certify culinary teams in zero-waste operational excellence."
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'trial',
    title: '3-Day Free Trial',
    price: '$0',
    numericPrice: 0,
    cadence: 'free for 3 days',
    badge: 'START RISK FREE',
    description: 'Instant 72-hour full unrestricted brigade access without credit card.',
    features: [
      'Full access to all 60+ zero-waste recipes',
      'Catalogue of byproducts & upcycling tips',
      'Interactive kitchen inventory dashboard',
      'Live community food rescue dispatch',
      'Unlimited access across mobile & tablet',
      'No upfront payment or card required'
    ],
    buttonText: 'START 3-DAY FREE TRIAL',
    highlighted: false,
    isTrial: true
  },
  {
    id: 'individual',
    title: 'Individual',
    price: '$99',
    numericPrice: 99,
    cadence: 'per person/year',
    description: 'Annual subscription. No per-module fees. Full access on every plan.',
    features: [
      'A library of zero-waste recipes',
      'Catalogue of byproducts and tips',
      'Training courses for chefs',
      'Best practices & SOP downloads',
      'Exclusive live masterclass Q&A calls with master mentors',
      'Members only newsletter',
      'Printable kitchen posters & prep guides',
      'Unlimited access to all resources',
      'Access to all future content',
      'Mobile app access'
    ],
    buttonText: 'JOIN NOW',
    highlighted: false,
    ziinaPayUrl: 'https://pay.ziina.com/topinfluencer/PXdVCwkJTu?source=app'
  },
  {
    id: 'team',
    title: 'Team',
    price: '$79',
    numericPrice: 79,
    cadence: 'per chef/year',
    badge: 'MOST POPULAR',
    description: 'Minimum 5 chefs included. Perfect for restaurant and hotel brigades.',
    features: [
      'Everything in Individual plan, plus:',
      'Team progress tracking & analytics',
      'Engagement reports for Head Chefs',
      'Minimum 5 chefs included',
      'Dedicated brigade onboarding kit',
      'Shared kitchen recipe binder',
      'Priority live Q&A sessions'
    ],
    buttonText: 'GET STARTED',
    highlighted: true,
    ziinaPayUrl: 'https://pay.ziina.com/topinfluencer/K_Yuf5UfM?source=app'
  },
  {
    id: 'training',
    title: 'Training',
    price: '$1499',
    numericPrice: 1499,
    cadence: 'per 5 chefs/year',
    badge: 'EXECUTIVE ADVISORY',
    description: 'Comprehensive operational transformation and executive culinary advisory.',
    features: [
      'Everything in the Team plan, plus:',
      '3x tailored private online sessions',
      'Private dedicated brigade advisory channel',
      'Food waste data review & bin audit analysis',
      'Customized menu circularity roadmap',
      'Certified Zero Waste Brigade credential'
    ],
    buttonText: 'ENQUIRE NOW',
    highlighted: false,
    ziinaPayUrl: 'https://pay.ziina.com/topinfluencer/V4v9zEpeg?source=app'
  }
];

export const PROBLEM_SOLUTION_DATA = {
  problem: {
    badge: "THE PROBLEM IN COMMERCIAL KITCHENS",
    title: "Why Millions in Edible Food End Up in Kitchen Bins",
    subtitle: "Commercial kitchens discard up to 40% of purchased ingredients. It is not an inevitable cost of hospitality—it is an unchecked operational leakage.",
    stats: [
      { value: "30-40%", label: "Average food purchased that is wasted", detail: "In hotel, resort, and restaurant operations worldwide." },
      { value: "6% - 9%", label: "Direct hit to gross profit margins", detail: "Food costs thrown straight into trash bags every single shift." },
      { value: "1.3B Tons", label: "Global edible food wasted annually", detail: "Generating 8-10% of all greenhouse gas emissions globally." }
    ],
    painPoints: [
      {
        icon: "Trash2",
        title: "Invisible Prep Scraps",
        desc: "Stems, peelings, crusts, and husks are discarded automatically during prep because cooks lack the formulas to upcycle them into menu assets."
      },
      {
        icon: "Users",
        title: "Buffet & Banquet Overproduction",
        desc: "Fear of running out leads to large holding pans that degrade under heat lamps and get tossed due to lack of cold-chain triage."
      },
      {
        icon: "AlertTriangle",
        title: "No Live Inventory Expiration Alerting",
        desc: "Walk-in chillers lack real-time visibility. By the time chefs realize a batch is near expiration, it is already too late to rescue."
      },
      {
        icon: "HeartHandshake",
        title: "Disconnected from Community Shelters",
        desc: "Kitchens want to donate wholesome zero waste unserved meals, but without instant digital dispatch, safe transport and logistics are too slow."
      }
    ]
  },
  whatWeCanDo: {
    badge: "WHAT WE CAN DO",
    title: "Shifting the Mindset: From Waste Guilt to Culinary Technique",
    subtitle: "We don't preach sustainability with slogans. We give chefs the culinary mastery and digital tools to transform every trimming into margin.",
    pillars: [
      {
        title: "Rewire Kitchen Psychology",
        desc: "Teach culinary brigades that throwing edible trimmings into a bin is the equivalent of throwing cash into a paper shredder."
      },
      {
        title: "Root-to-Leaf Gastronomy",
        desc: "Equip chefs with formulas: turn allium skins into golden dashi, stale sourdough into rich miso, and citrus rinds into high-margin cordials."
      },
      {
        title: "Dynamic Buffer Planning",
        desc: "Implement batch cooking cadences and vessel scaling that keep buffet displays looking abundant with half the overproduction."
      },
      {
        title: "Automated Food Rescue",
        desc: "Bridge kitchen loading docks with verified local food banks to dispatch zero waste meals safely before spoilage."
      }
    ]
  },
  howToFixIt: {
    badge: "HOW TO FIX IT",
    title: "The 4-Step Operational Framework",
    subtitle: "A proven, repeatable system implemented across 120+ international hotel and restaurant brigades.",
    steps: [
      {
        step: "01",
        title: "Measure & Audit the Bins",
        desc: "Execute a 48-hour station audit. Weigh prep trimmings, spoilage, and buffet returns to pinpoint the exact dollar leakage."
      },
      {
        step: "02",
        title: "Build Circular Recipe Loops",
        desc: "Link every high-volume menu prep item to a companion upcycling recipe that replaces an expensive purchased pantry item."
      },
      {
        step: "03",
        title: "Deploy Live Station Tracking",
        desc: "Use the Zero waste by Supritamone dashboard to track batch weights, shelf-life countdowns, and receive instant recipe matches."
      },
      {
        step: "04",
        title: "One-Click Community Dispatch",
        desc: "When zero waste meals exceed kitchen storage, tap one button to dispatch temperature-verified donation alerts to local shelters."
      }
    ]
  },
  solutions: {
    badge: "THE SOLUTIONS",
    title: "Everything a Chef Needs to Run a Zero-Waste Operation",
    subtitle: "Practical, pocket-sized, and built directly for fast-paced commercial kitchens.",
    items: [
      {
        title: "The Searchable Byproduct Catalogue",
        desc: "Over 60 common kitchen byproducts with step-by-step culinary solutions. Look up any trimming and stop throwing money in the bin."
      },
      {
        title: "Brigade Video Mini-Courses",
        desc: "Short, 3-minute video lessons on prep waste, buffet waste, and circular menu engineering. Ready in your pocket before service."
      },
      {
        title: "Live Inventory Tracking & Expiration Alerts",
        desc: "Real-time visibility across Prep, Larder, Hot Line, Pastry, and Banquet. Freshness meters alert cooks before items degrade."
      },
      {
        title: "Community Food Rescue Dispatch",
        desc: "Instantly alert local food banks and shelters with required holding temperatures (Chilled <4°C, Ambient, Frozen) and pickup windows."
      }
    ]
  }
};
