// jest.setup.js

// Deshabilitar completamente la verificación de Expo
jest.mock('expo', () => ({}), { virtual: true });

// Mock global de expo
global.__ExpoImportMetaRegistry = new Map();

// Mock de require.context
if (!global.require.context) {
  global.require.context = () => ({
    keys: () => [],
    resolve: () => null,
  });
}

// Mock de require.context si no existe
if (!global.require.context) {
  global.require.context = () => ({
    keys: () => [],
    resolve: () => null,
  });
}

// Mock de NativeWind
jest.mock('nativewind', () => ({
  styled: () => (component) => component,
}));

// Mock de expo
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
}));

// Mock de expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/',
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

// Mock de expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock de react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  BarChart: 'BarChart',
  PieChart: 'PieChart',
}));

// Mock de react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Rect: 'Rect',
  Path: 'Path',
}));

// Mock de @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Silenciar warnings de React Navigation
const originalWarn = console.warn;
const originalError = console.error;
global.console = {
  ...console,
  warn: (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React does not recognize') ||
       args[0].includes('componentWillReceiveProps'))
    ) {
      return;
    }
    originalWarn(...args);
  },
  error: (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError(...args);
  },
};
