import type { IconName } from '../components/Icon';

/** Bundled image, as returned by require(). */
export type ImageAsset = number;

export type CategoryId =
  | 'cappuccino'
  | 'latte'
  | 'macchiato'
  | 'americano'
  | 'espresso'
  | 'iced'
  | 'alternative';

export type Temperature = 'hot' | 'iced';
export type Size = 'S' | 'M' | 'L';

export type Coffee = {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  temperature: Temperature;
  /** Price for size M, in USD. */
  price: number;
  rating: number;
  reviews: number;
  description: string;
  image: ImageAsset;
  /** Popularity rank used by the «Популярные» sort (lower is more popular). */
  popularity: number;
  /** Feature badges shown on the detail screen. */
  features: Feature[];
};

export type Feature = 'delivery' | 'beans' | 'milk' | 'ice' | 'vegan';

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  image: ImageAsset;
};

export const SIZES: { id: Size; label: string; volume: number; delta: number }[] = [
  { id: 'S', label: 'S', volume: 250, delta: -0.4 },
  { id: 'M', label: 'M', volume: 350, delta: 0 },
  { id: 'L', label: 'L', volume: 450, delta: 0.6 },
];

export const categories: Category[] = [
  {
    id: 'cappuccino',
    name: 'Капучино',
    description: 'Эспрессо и плотная молочная пена',
    image: require('../../assets/images/coffee/cappuccino.jpg'),
  },
  {
    id: 'macchiato',
    name: 'Макиато',
    description: 'Эспрессо с каплей молочной пены',
    image: require('../../assets/images/coffee/macchiato.jpg'),
  },
  {
    id: 'latte',
    name: 'Латте',
    description: 'Мягкий, много молока',
    image: require('../../assets/images/coffee/latte.jpg'),
  },
  {
    id: 'americano',
    name: 'Американо',
    description: 'Эспрессо, разбавленный водой',
    image: require('../../assets/images/coffee/americano.jpg'),
  },
  {
    id: 'espresso',
    name: 'Эспрессо',
    description: 'Короткий и насыщенный',
    image: require('../../assets/images/coffee/espresso.jpg'),
  },
  {
    id: 'iced',
    name: 'Холодные',
    description: 'Со льдом и колд брю',
    image: require('../../assets/images/coffee/iced-latte.jpg'),
  },
  {
    id: 'alternative',
    name: 'Альтернатива',
    description: 'Пуровер и матча',
    image: require('../../assets/images/coffee/pour-over.jpg'),
  },
];

export const coffees: Coffee[] = [
  {
    id: 'caffe-mocha',
    name: 'Кофе мокко',
    subtitle: 'Молочная пена',
    category: 'cappuccino',
    temperature: 'hot',
    price: 4.53,
    rating: 4.8,
    reviews: 230,
    popularity: 1,
    features: ['delivery', 'beans', 'milk'],
    description:
      'Капучино — это около 150 мл (5 унций) напитка: 25 мл эспрессо и 85 мл свежего молока, взбитого в бархатную пену. В мокко добавляем тёмный шоколад, поэтому вкус получается глубоким, с нотами какао и карамели. Подаём горячим, по желанию — с корицей.',
    image: require('../../assets/images/coffee/mocha.jpg'),
  },
  {
    id: 'flat-white',
    name: 'Флэт уайт',
    subtitle: 'Эспрессо',
    category: 'latte',
    temperature: 'hot',
    price: 3.53,
    rating: 4.8,
    reviews: 184,
    popularity: 2,
    features: ['delivery', 'beans', 'milk'],
    description:
      'Двойной ристретто и тонкий слой микропены. Молока меньше, чем в латте, поэтому кофе звучит ярче, а текстура остаётся шелковистой. Хороший выбор для тех, кто любит вкус зерна.',
    image: require('../../assets/images/coffee/flat-white.jpg'),
  },
  {
    id: 'cappuccino',
    name: 'Капучино',
    subtitle: 'Классический',
    category: 'cappuccino',
    temperature: 'hot',
    price: 3.8,
    rating: 4.7,
    reviews: 312,
    popularity: 3,
    features: ['delivery', 'beans', 'milk'],
    description:
      'Эспрессо, горячее молоко и плотная молочная шапка в равных пропорциях. Классика, с которой начинается утро. Рисунок на пене бариста делает вручную.',
    image: require('../../assets/images/coffee/cappuccino.jpg'),
  },
  {
    id: 'caffe-latte',
    name: 'Латте',
    subtitle: 'С молоком',
    category: 'latte',
    temperature: 'hot',
    price: 3.9,
    rating: 4.6,
    reviews: 268,
    popularity: 4,
    features: ['delivery', 'beans', 'milk'],
    description:
      'Один шот эспрессо и много нежного молока с тонкой пеной. Самый мягкий напиток в меню: хорошо сочетается с сиропами и альтернативным молоком.',
    image: require('../../assets/images/coffee/latte.jpg'),
  },
  {
    id: 'caramel-macchiato',
    name: 'Карамельный макиато',
    subtitle: 'С карамелью',
    category: 'macchiato',
    temperature: 'hot',
    price: 4.2,
    rating: 4.9,
    reviews: 156,
    popularity: 5,
    features: ['delivery', 'beans', 'milk'],
    description:
      'Ванильное молоко, эспрессо сверху и тонкая сетка карамельного соуса. Слои видно в чашке, а вкус раскрывается постепенно — от сливочного к кофейному.',
    image: require('../../assets/images/coffee/macchiato.jpg'),
  },
  {
    id: 'raf',
    name: 'Раф',
    subtitle: 'Сливочный',
    category: 'latte',
    temperature: 'hot',
    price: 4.4,
    rating: 4.7,
    reviews: 141,
    popularity: 6,
    features: ['delivery', 'beans', 'milk'],
    description:
      'Эспрессо, взбитый вместе со сливками и ванильным сахаром. Плотный, десертный, без отдельного слоя пены. Московская классика, которую любят сладкоежки.',
    image: require('../../assets/images/coffee/raf.jpg'),
  },
  {
    id: 'americano',
    name: 'Американо',
    subtitle: 'Чёрный',
    category: 'americano',
    temperature: 'hot',
    price: 2.6,
    rating: 4.5,
    reviews: 198,
    popularity: 7,
    features: ['delivery', 'beans', 'vegan'],
    description:
      'Двойной эспрессо, разбавленный горячей водой. Чистый вкус зерна без молока: ореховые ноты, лёгкая кислинка и долгое послевкусие.',
    image: require('../../assets/images/coffee/americano.jpg'),
  },
  {
    id: 'lungo',
    name: 'Лунго',
    subtitle: 'Длинный эспрессо',
    category: 'americano',
    temperature: 'hot',
    price: 2.9,
    rating: 4.4,
    reviews: 87,
    popularity: 11,
    features: ['delivery', 'beans', 'vegan'],
    description:
      'Эспрессо, пролитый дольше обычного: больше объём, мягче крепость, заметнее горчинка. Для тех, кому американо слишком водянистый, а эспрессо — слишком короткий.',
    image: require('../../assets/images/coffee/lungo.jpg'),
  },
  {
    id: 'espresso',
    name: 'Эспрессо',
    subtitle: 'Двойной шот',
    category: 'espresso',
    temperature: 'hot',
    price: 2.2,
    rating: 4.6,
    reviews: 120,
    popularity: 9,
    features: ['delivery', 'beans', 'vegan'],
    description:
      'Двойной шот из бленда бразильской и эфиопской арабики. Плотное тело, ноты тёмного шоколада и спелой вишни, стойкая крема.',
    image: require('../../assets/images/coffee/espresso.jpg'),
  },
  {
    id: 'iced-latte',
    name: 'Айс латте',
    subtitle: 'Со льдом',
    category: 'iced',
    temperature: 'iced',
    price: 4.1,
    rating: 4.7,
    reviews: 176,
    popularity: 8,
    features: ['delivery', 'milk', 'ice'],
    description:
      'Холодное молоко, лёд и шот эспрессо сверху. Освежает в жару и отлично сочетается с карамельным или ванильным сиропом.',
    image: require('../../assets/images/coffee/iced-latte.jpg'),
  },
  {
    id: 'cold-brew',
    name: 'Колд брю',
    subtitle: 'Холодное заваривание',
    category: 'iced',
    temperature: 'iced',
    price: 3.7,
    rating: 4.6,
    reviews: 94,
    popularity: 10,
    features: ['delivery', 'beans', 'ice'],
    description:
      'Кофе, который 16 часов настаивается в холодной воде. Получается мягким, сладковатым и почти без горечи. Подаём со льдом.',
    image: require('../../assets/images/coffee/cold-brew.jpg'),
  },
  {
    id: 'matcha-latte',
    name: 'Матча латте',
    subtitle: 'Без кофеина',
    category: 'alternative',
    temperature: 'hot',
    price: 4.6,
    rating: 4.5,
    reviews: 73,
    popularity: 12,
    features: ['delivery', 'milk', 'vegan'],
    description:
      'Японский зелёный чай матча, взбитый с горячим молоком. Травянистый, сливочный, с мягкой бодростью без кофейной резкости.',
    image: require('../../assets/images/coffee/matcha.jpg'),
  },
  {
    id: 'pour-over',
    name: 'Пуровер',
    subtitle: 'Фильтр-кофе',
    category: 'alternative',
    temperature: 'hot',
    price: 3.4,
    rating: 4.8,
    reviews: 61,
    popularity: 13,
    features: ['delivery', 'beans', 'vegan'],
    description:
      'Ручная заварка через воронку из зёрен светлой обжарки. Чистая чашка с ягодными и цветочными нотами. Заваривается около четырёх минут.',
    image: require('../../assets/images/coffee/pour-over.jpg'),
  },
];

export const featureMeta: Record<Feature, { label: string; icon: IconName }> = {
  delivery: { label: 'Быстрая доставка', icon: 'bicycle-outline' },
  beans: { label: 'Свежая обжарка', icon: 'leaf-outline' },
  milk: { label: 'Фермерское молоко', icon: 'water-outline' },
  ice: { label: 'Подаётся со льдом', icon: 'snow-outline' },
  vegan: { label: 'Можно без молока', icon: 'flower-outline' },
};

export const getCoffee = (id: string | undefined) => coffees.find((c) => c.id === id);
export const getCategory = (id: string | undefined) => categories.find((c) => c.id === id);
export const countInCategory = (id: CategoryId) => coffees.filter((c) => c.category === id).length;

export const POPULAR_QUERIES = ['Латте', 'Капучино', 'Колд брю', 'Мокко', 'Без молока', 'Со льдом'];
