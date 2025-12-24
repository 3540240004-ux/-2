
import { LevelId, LevelConfig, Bird } from './types';

export const LEVELS: Record<LevelId, LevelConfig> = {
  [LevelId.GLASS_MAZE]: {
    id: LevelId.GLASS_MAZE,
    title: '幻影迷局',
    subtitle: '针对：玻璃反射与透射导致鸟撞',
    description: 'CBD商业区。大楼全是镜面玻璃。鸟儿会误以为玻璃里反射的是森林。',
    budget: 500,
    maxSatisfaction: 100,
  },
  [LevelId.LIGHT_TRAP]: {
    id: LevelId.LIGHT_TRAP,
    title: '光之陷阱',
    subtitle: '针对：光污染导致方向迷失',
    description: '夜晚的城市。强光让候鸟迷失方向，力竭而亡。',
    budget: 400,
    maxSatisfaction: 100,
  },
  [LevelId.AERIAL_SNARE]: {
    id: LevelId.AERIAL_SNARE,
    title: '空中罗网',
    subtitle: '针对：空中杂物与危险空域',
    description: '湿地公园。高压电线、风筝线、无人机。',
    budget: 300,
    maxSatisfaction: 100,
  }
};

export const INITIAL_BIRDS: Bird[] = [
  {
    id: 'bird1',
    name: '东方白鹳',
    scientificName: 'Ciconia boyciana',
    description: '由于湿地丧失而受威胁，它们常在高大的构筑物上筑巢。',
    status: 'endangered',
    unlocked: false,
    image: 'https://picsum.photos/seed/stork/400/300'
  },
  {
    id: 'bird2',
    name: '仙八色鸫',
    scientificName: 'Pitta nympha',
    description: '非常美丽的候鸟，但也容易在低层建筑玻璃前发生碰撞。',
    status: 'vulnerable',
    unlocked: false,
    image: 'https://picsum.photos/seed/pitta/400/300'
  },
  {
    id: 'bird3',
    name: '蓝喉歌鸲',
    scientificName: 'Luscinia svecica',
    description: '体型小，对玻璃反射的植被极其敏感。',
    status: 'common',
    unlocked: false,
    image: 'https://picsum.photos/seed/bluethroat/400/300'
  }
];
