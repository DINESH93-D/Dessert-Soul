import steamedIdliImg from '../assets/images/menu_steamed_idli_1794733503205.jpg';
import podiIdliImg from '../assets/images/menu_podi_idli_1794733503831.jpg';
import masalaDosaImg from '../assets/images/menu_masala_dosa_1794733503837.jpg';
import gheeDosaImg from '../assets/images/menu_ghee_dosa_1794733504793.jpg';
import venPongalImg from '../assets/images/menu_ven_pongal_1794733505225.jpg';
import pooriMasalaImg from '../assets/images/menu_poori_masala_1794733505627.jpg';
import onionUthappamImg from '../assets/images/menu_onion_uthappam_1794733505352.jpg';
import meduVadaImg from '../assets/images/menu_medu_vada_1794733506829.jpg';
import lemonRiceImg from '../assets/images/menu_lemon_rice_1794733507123.jpg';
import curdRiceImg from '../assets/images/menu_curd_rice_1794733506570.jpg';

import vegFriedRiceImg from '../assets/images/menu_veg_friedrice_1794733507598.jpg';
import paneerFriedRiceImg from '../assets/images/menu_paneer_friedrice_1794733507442.jpg';
import hakkaNoodlesImg from '../assets/images/menu_hakka_noodles_1794733507439.jpg';
import schezwanRiceImg from '../assets/images/menu_schezwan_rice_1794733508155.jpg';
import chilliPaneerImg from '../assets/images/menu_chilli_paneer_1794733508286.jpg';
import gobiManchurianImg from '../assets/images/menu_gobi_manchurian_1794733508833.jpg';
import manchowSoupImg from '../assets/images/menu_manchow_soup_1794733509733.jpg';
import springRollsImg from '../assets/images/menu_spring_rolls_1794733510351.jpg';
import schezwanNoodlesImg from '../assets/images/menu_schezwan_noodles_1794733510402.jpg';
import crispyCornImg from '../assets/images/menu_crispy_corn_1794733511019.jpg';

import filterCoffeeImg from '../assets/images/menu_filter_coffee_1794733511576.jpg';
import masalaTeaImg from '../assets/images/menu_masala_tea_1794733511749.jpg';
import limeSodaImg from '../assets/images/menu_lime_soda_1794733511338.jpg';
import mintCoolerImg from '../assets/images/menu_mint_cooler_1794733512504.jpg';
import coldCoffeeImg from '../assets/images/menu_cold_coffee_1794733511883.jpg';
import icedAmericanoImg from '../assets/images/menu_iced_americano_1794733513200.jpg';
import classicCappuccinoImg from '../assets/images/menu_classic_cappuccino_1794733512822.jpg';
import hotChocolateImg from '../assets/images/menu_hot_chocolate_1794733513273.jpg';
import mangoMilkshakeImg from '../assets/images/menu_mango_milkshake_1794733514082.jpg';
import oreoMilkshakeImg from '../assets/images/menu_oreo_milkshake_1794733513915.jpg';

import heroArtisanCakeImg from '../assets/images/hero_artisan_cake_1794733514700.jpg';
import storyCozyCafeImg from '../assets/images/story_cozy_cafe_1794733515293.jpg';
import storyWarmCoffeeImg from '../assets/images/story_warm_coffee_1794733515460.jpg';

export type MenuCategory = 'All' | 'South Indian' | 'Chinese' | 'Drinks';

export interface MenuProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<MenuCategory, 'All'>;
  image: string;
  tag?: string;
}

export const SITE_IMAGES = {
  heroCake: heroArtisanCakeImg,
  storyCafe: storyCozyCafeImg,
  storyCoffee: storyWarmCoffeeImg,
};

export const CATEGORY_INTROS: Record<MenuCategory, string> = {
  All: 'Explore our menu, thoughtfully grouped for every craving.',
  'South Indian': 'South Indian favourites · 10 freshly prepared choices.',
  Chinese: 'Indo-Chinese cafe classics · 10 flavour-packed choices.',
  Drinks: 'Coffee, tea, coolers and milkshakes · 10 refreshing choices.',
};

export const MENU_PRODUCTS: MenuProduct[] = [
  // SOUTH INDIAN — 10 items
  {
    id: 1,
    name: 'Idli (2 pcs)',
    description: 'Soft steamed rice cakes · sambar · 2 chutneys',
    price: 45,
    category: 'South Indian',
    image: steamedIdliImg,
    tag: 'POPULAR',
  },
  {
    id: 2,
    name: 'Ghee Podi Idli',
    description: 'Mini idlis tossed in house podi · ghee',
    price: 85,
    category: 'South Indian',
    image: podiIdliImg,
  },
  {
    id: 3,
    name: 'Crispy Masala Dosa',
    description: 'Golden dosa · potato masala · sambar · chutneys',
    price: 95,
    category: 'South Indian',
    image: masalaDosaImg,
  },
  {
    id: 4,
    name: 'Ghee Roast Dosa',
    description: 'Crisp paper dosa finished with aromatic ghee',
    price: 110,
    category: 'South Indian',
    image: gheeDosaImg,
    tag: 'HOUSE FAVOURITE',
  },
  {
    id: 5,
    name: 'Pongal',
    description: 'Pepper-cumin ven pongal · sambar · coconut chutney',
    price: 85,
    category: 'South Indian',
    image: venPongalImg,
  },
  {
    id: 6,
    name: 'Poori Masala (2 pcs)',
    description: 'Fluffy pooris · potato masala · pickle',
    price: 90,
    category: 'South Indian',
    image: pooriMasalaImg,
  },
  {
    id: 7,
    name: 'Onion Uthappam',
    description: 'Soft rice-lentil pancake · onion · green chilli',
    price: 100,
    category: 'South Indian',
    image: onionUthappamImg,
  },
  {
    id: 8,
    name: 'Medu Vada (2 pcs)',
    description: 'Crispy outside · soft centre · sambar · chutney',
    price: 60,
    category: 'South Indian',
    image: meduVadaImg,
  },
  {
    id: 9,
    name: 'Lemon Rice',
    description: 'Tempered rice · lemon · peanuts · papad',
    price: 90,
    category: 'South Indian',
    image: lemonRiceImg,
  },
  {
    id: 10,
    name: 'Curd Rice',
    description: 'Creamy curd rice · tempered spices · pickle',
    price: 80,
    category: 'South Indian',
    image: curdRiceImg,
  },

  // CHINESE — 10 items
  {
    id: 11,
    name: 'Veg Fried Rice',
    description: 'Wok-tossed rice · vegetables · spring onion',
    price: 140,
    category: 'Chinese',
    image: vegFriedRiceImg,
    tag: 'POPULAR',
  },
  {
    id: 12,
    name: 'Paneer Fried Rice',
    description: 'Wok-fried rice · paneer · peppers · soy',
    price: 170,
    category: 'Chinese',
    image: paneerFriedRiceImg,
  },
  {
    id: 13,
    name: 'Veg Hakka Noodles',
    description: 'Stir-fried noodles · crunchy vegetables · mild sauces',
    price: 150,
    category: 'Chinese',
    image: hakkaNoodlesImg,
  },
  {
    id: 14,
    name: 'Schezwan Fried Rice',
    description: 'Spicy wok-fried rice · house Schezwan sauce',
    price: 160,
    category: 'Chinese',
    image: schezwanRiceImg,
  },
  {
    id: 15,
    name: 'Chilli Paneer',
    description: 'Paneer cubes · peppers · onion · Indo-Chinese sauce',
    price: 190,
    category: 'Chinese',
    image: chilliPaneerImg,
  },
  {
    id: 16,
    name: 'Gobi Manchurian',
    description: 'Crisp cauliflower · ginger-garlic · Manchurian glaze',
    price: 150,
    category: 'Chinese',
    image: gobiManchurianImg,
  },
  {
    id: 17,
    name: 'Veg Manchow Soup',
    description: 'Hot savoury soup · vegetables · crispy noodles',
    price: 110,
    category: 'Chinese',
    image: manchowSoupImg,
  },
  {
    id: 18,
    name: 'Spring Rolls (4 pcs)',
    description: 'Crispy pastry rolls · seasoned vegetable filling',
    price: 130,
    category: 'Chinese',
    image: springRollsImg,
  },
  {
    id: 19,
    name: 'Schezwan Noodles',
    description: 'Noodles tossed in spicy Schezwan sauce · vegetables',
    price: 160,
    category: 'Chinese',
    image: schezwanNoodlesImg,
  },
  {
    id: 20,
    name: 'Crispy Corn',
    description: 'Golden corn kernels · pepper · chilli · herbs',
    price: 130,
    category: 'Chinese',
    image: crispyCornImg,
  },

  // DRINKS — 10 items
  {
    id: 21,
    name: 'Filter Coffee',
    description: 'Traditional South Indian degree coffee',
    price: 35,
    category: 'Drinks',
    image: filterCoffeeImg,
    tag: 'CAFE CLASSIC',
  },
  {
    id: 22,
    name: 'Masala Tea',
    description: 'Freshly brewed tea · ginger · cardamom',
    price: 30,
    category: 'Drinks',
    image: masalaTeaImg,
  },
  {
    id: 23,
    name: 'Fresh Lime Soda',
    description: 'Fresh lime · soda · sweet or salted',
    price: 65,
    category: 'Drinks',
    image: limeSodaImg,
  },
  {
    id: 24,
    name: 'Lime Mint Cooler',
    description: 'Fresh lime · mint · chilled soda',
    price: 80,
    category: 'Drinks',
    image: mintCoolerImg,
  },
  {
    id: 25,
    name: 'Cold Coffee',
    description: 'Chilled coffee · milk · light sweetness',
    price: 110,
    category: 'Drinks',
    image: coldCoffeeImg,
  },
  {
    id: 26,
    name: 'Iced Americano',
    description: 'Double espresso · chilled water · ice',
    price: 100,
    category: 'Drinks',
    image: icedAmericanoImg,
  },
  {
    id: 27,
    name: 'Classic Cappuccino',
    description: 'Espresso · steamed milk · soft foam',
    price: 120,
    category: 'Drinks',
    image: classicCappuccinoImg,
  },
  {
    id: 28,
    name: 'Hot Chocolate',
    description: 'Creamy cocoa · steamed milk · chocolate',
    price: 130,
    category: 'Drinks',
    image: hotChocolateImg,
  },
  {
    id: 29,
    name: 'Mango Milkshake',
    description: 'Mango · chilled milk · ice cream',
    price: 130,
    category: 'Drinks',
    image: mangoMilkshakeImg,
  },
  {
    id: 30,
    name: 'Oreo Milkshake',
    description: 'Oreo cookies · chilled milk · ice cream',
    price: 140,
    category: 'Drinks',
    image: oreoMilkshakeImg,
  },
];
