export const TILE_WIDTH = 128;
export const TILE_HEIGHT = 64;

export const COLORS = {
  // Warm stone floor
  floor: '#c4b59a',
  floorLight: '#d4c5aa',
  floorStroke: '#a89878',
  // Walls - solid stone
  wall: '#7a6e5a',
  wallSide: '#5a5040',
  wallTop: '#8a7e6a',
  wallStroke: '#4a4030',
  // Target - glowing green
  target: '#88c878',
  targetLight: '#a8e898',
  targetStroke: '#58a848',
  targetGlow: '#66dd55',
  // Pit - dark void
  pit: '#2a2018',
  pitInner: '#1a1008',
  pitStroke: '#4a3828',
  // Destructible - cracked brown
  destructible: '#9a7a55',
  destructibleSide: '#7a5a35',
  destructibleDark: '#6a4a25',
  destructibleStroke: '#5a3a15',
  void: 'transparent',
  // Player - bright teal character
  player: '#44ccaa',
  playerDark: '#2a9977',
  playerLight: '#77eedd',
  playerSkin: '#ffcc99',
  playerHair: '#553322',
  playerStroke: '#227755',
  // Dice - big, bold, colorful
  dieWhite: '#f5f0e8',
  dieWhiteSide: '#d8d0c4',
  dieWhiteDark: '#bab2a6',
  dieRed: '#ee4444',
  dieRedSide: '#cc2222',
  dieRedDark: '#aa1111',
  dieBlue: '#4488ee',
  dieBlueSide: '#2266cc',
  dieBlueDark: '#1144aa',
  pip: '#333322',
  pipWhite: '#ffffff',
  explosion: '#ff6644',
  gridLine: '#b0a080',
  // Background
  bg: '#e8dcc8',
} as const;
