export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  RUB: '₽',
  AUD: '$',
  CAD: '$',
  CHF: 'CHF', // Often represented as 'Fr.' or 'CHF'
  HKD: 'HK$',
  NZD: 'NZ$',
  SEK: 'kr',
  KRW: '₩',
  SGD: 'S$',
  NOK: 'kr',
  MXN: 'Mex$',
  BRL: 'R$',
  ALL: 'Lek', // Albanian Lek
  AFN: '؋', // Afghan Afghani
  ARS: '$', // Argentine Peso
  AWG: 'ƒ', // Aruban Florin
  AZN: '₼', // Azerbaijani Manat
  BHD: '.د.ب', // Bahraini Dinar
  BBD: 'Bds$', // Barbadian Dollar
  BDT: '৳', // Bangladeshi Taka
  BZD: 'BZ$', // Belize Dollar
  BMD: '$', // Bermudian Dollar
  BOB: 'Bs.', // Bolivian Boliviano
  BAM: 'KM', // Bosnia and Herzegovina Convertible Mark
  BWP: 'P', // Botswanan Pula
  BGN: 'лв', // Bulgarian Lev
  KHR: '៛', // Cambodian Riel
  CVE: 'Esc', // Cape Verdean Escudo
  CLP: '$', // Chilean Peso
  COP: '$', // Colombian Peso
  CRC: '₡', // Costa Rican Colón
  HRK: 'kn', // Croatian Kuna (Note: Croatia now uses EUR)
  CUP: '₱', // Cuban Peso
  CZK: 'Kč', // Czech Koruna
  DKK: 'kr', // Danish Krone
  DOP: 'RD$', // Dominican Peso
  EGP: 'E£', // Egyptian Pound
  FJD: 'FJ$', // Fijian Dollar
  GHS: '₵', // Ghanaian Cedi
  GTQ: 'Q', // Guatemalan Quetzal
  HNL: 'L', // Honduran Lempira
  HUF: 'Ft', // Hungarian Forint
  ISK: 'kr', // Icelandic Króna
  IDR: 'Rp', // Indonesian Rupiah
  ILS: '₪', // Israeli New Shekel
  JMD: 'J$', // Jamaican Dollar
  KZT: '₸', // Kazakhstani Tenge
  KES: 'KSh', // Kenyan Shilling
  KWD: 'د.ك', // Kuwaiti Dinar
  LAK: '₭', // Lao Kip
  LBP: 'L.L.', // Lebanese Pound
  LRD: 'L$', // Liberian Dollar
  MKD: 'ден', // Macedonian Denar
  MYR: 'RM', // Malaysian Ringgit
  MUR: '₨', // Mauritian Rupee
  MDL: 'L', // Moldovan Leu
  MNT: '₮', // Mongolian Tögrög
  MAD: 'د.م.', // Moroccan Dirham
  NAD: 'N$', // Namibian Dollar
  NPR: '₨', // Nepalese Rupee
  NIO: 'C$', // Nicaraguan Córdoba
  NGN: '₦', // Nigerian Naira
  OMR: 'ر.ع.', // Omani Rial
  PKR: '₨', // Pakistani Rupee
  PAB: 'B/.', // Panamanian Balboa
  PYG: '₲', // Paraguayan Guarani
  PEN: 'S/.', // Peruvian Sol
  PHP: '₱', // Philippine Peso
  PLN: 'zł', // Polish Złoty
  QAR: 'ر.ق', // Qatari Riyal
  RON: 'lei', // Romanian Leu
  RSD: 'дин', // Serbian Dinar
  SAR: 'ر.س', // Saudi Riyal
  SCR: '₨', // Seychellois Rupee
  SLL: 'Le', // Sierra Leonean Leone
  ZAR: 'R', // South African Rand
  LKR: 'Rs', // Sri Lankan Rupee
  SRD: '$', // Surinamese Dollar
  SYP: '£', // Syrian Pound
  TWD: 'NT$', // New Taiwan Dollar
  TZS: 'TSh', // Tanzanian Shilling
  THB: '฿', // Thai Baht
  TTD: 'TT$', // Trinidad and Tobago Dollar
  TND: 'د.ت', // Tunisian Dinar
  TRY: '₺', // Turkish Lira
  UGX: 'USh', // Ugandan Shilling
  UAH: '₴', // Ukrainian Hryvnia
  AED: 'د.إ', // United Arab Emirates Dirham
  UYU: '$U', // Uruguayan Peso
  UZS: 'сум', // Uzbekistani Som
  VEF: 'Bs.F', // Venezuelan Bolívar Fuerte (Note: now VED or VES)
  VND: '₫', // Vietnamese Đồng
  XAF: 'FCFA', // CFA Franc BEAC
  XCD: 'EC$', // East Caribbean Dollar
  XOF: 'CFA', // CFA Franc BCEAO
  YER: '﷼', // Yemeni Rial
  ZMW: 'K', // Zambian Kwacha
  ZWL: 'Z$', // Zimbabwean Dollar
};

/**
 * Interface for a currency object
 */
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

/**
 * Array of commonly used currencies with their codes, names, and symbols.
 * This array can be used for dropdowns, lists, etc.
 */
export const currencies: Currency[] = [
  {code: 'USD', name: 'United States Dollar', symbol: currencySymbols.USD},
  {code: 'EUR', name: 'Euro', symbol: currencySymbols.EUR},
  {code: 'GBP', name: 'British Pound Sterling', symbol: currencySymbols.GBP},
  {code: 'JPY', name: 'Japanese Yen', symbol: currencySymbols.JPY},
  {code: 'CNY', name: 'Chinese Yuan', symbol: currencySymbols.CNY},
  {code: 'INR', name: 'Indian Rupee', symbol: currencySymbols.INR},
  {code: 'RUB', name: 'Russian Ruble', symbol: currencySymbols.RUB},
  {code: 'AUD', name: 'Australian Dollar', symbol: currencySymbols.AUD},
  {code: 'CAD', name: 'Canadian Dollar', symbol: currencySymbols.CAD},
  {code: 'CHF', name: 'Swiss Franc', symbol: currencySymbols.CHF},
  {code: 'HKD', name: 'Hong Kong Dollar', symbol: currencySymbols.HKD},
  {code: 'NZD', name: 'New Zealand Dollar', symbol: currencySymbols.NZD},
  {code: 'SEK', name: 'Swedish Krona', symbol: currencySymbols.SEK},
  {code: 'KRW', name: 'South Korean Won', symbol: currencySymbols.KRW},
  {code: 'SGD', name: 'Singapore Dollar', symbol: currencySymbols.SGD},
  {code: 'NOK', name: 'Norwegian Krone', symbol: currencySymbols.NOK},
  {code: 'MXN', name: 'Mexican Peso', symbol: currencySymbols.MXN},
  {code: 'BRL', name: 'Brazilian Real', symbol: currencySymbols.BRL},
  {code: 'ALL', name: 'Albanian Lek', symbol: currencySymbols.ALL},
  {code: 'AFN', name: 'Afghan Afghani', symbol: currencySymbols.AFN},
  {code: 'ARS', name: 'Argentine Peso', symbol: currencySymbols.ARS},
  {code: 'AWG', name: 'Aruban Florin', symbol: currencySymbols.AWG},
  {code: 'AZN', name: 'Azerbaijani Manat', symbol: currencySymbols.AZN},
  {code: 'BHD', name: 'Bahraini Dinar', symbol: currencySymbols.BHD},
  {code: 'BBD', name: 'Barbadian Dollar', symbol: currencySymbols.BBD},
  {code: 'BDT', name: 'Bangladeshi Taka', symbol: currencySymbols.BDT},
  {code: 'BZD', name: 'Belize Dollar', symbol: currencySymbols.BZD},
  {code: 'BMD', name: 'Bermudian Dollar', symbol: currencySymbols.BMD},
  {code: 'BOB', name: 'Bolivian Boliviano', symbol: currencySymbols.BOB},
  {
    code: 'BAM',
    name: 'Bosnia and Herzegovina Convertible Mark',
    symbol: currencySymbols.BAM,
  },
  {code: 'BWP', name: 'Botswanan Pula', symbol: currencySymbols.BWP},
  {code: 'BGN', name: 'Bulgarian Lev', symbol: currencySymbols.BGN},
  {code: 'KHR', name: 'Cambodian Riel', symbol: currencySymbols.KHR},
  {code: 'CVE', name: 'Cape Verdean Escudo', symbol: currencySymbols.CVE},
  {code: 'CLP', name: 'Chilean Peso', symbol: currencySymbols.CLP},
  {code: 'COP', name: 'Colombian Peso', symbol: currencySymbols.COP},
  {code: 'CRC', name: 'Costa Rican Colón', symbol: currencySymbols.CRC},
  {code: 'HRK', name: 'Croatian Kuna', symbol: currencySymbols.HRK},
  {code: 'CUP', name: 'Cuban Peso', symbol: currencySymbols.CUP},
  {code: 'CZK', name: 'Czech Koruna', symbol: currencySymbols.CZK},
  {code: 'DKK', name: 'Danish Krone', symbol: currencySymbols.DKK},
  {code: 'DOP', name: 'Dominican Peso', symbol: currencySymbols.DOP},
  {code: 'EGP', name: 'Egyptian Pound', symbol: currencySymbols.EGP},
  {code: 'FJD', name: 'Fijian Dollar', symbol: currencySymbols.FJD},
  {code: 'GHS', name: 'Ghanaian Cedi', symbol: currencySymbols.GHS},
  {code: 'GTQ', name: 'Guatemalan Quetzal', symbol: currencySymbols.GTQ},
  {code: 'HNL', name: 'Honduran Lempira', symbol: currencySymbols.HNL},
  {code: 'HUF', name: 'Hungarian Forint', symbol: currencySymbols.HUF},
  {code: 'ISK', name: 'Icelandic Króna', symbol: currencySymbols.ISK},
  {code: 'IDR', name: 'Indonesian Rupiah', symbol: currencySymbols.IDR},
  {code: 'ILS', name: 'Israeli New Shekel', symbol: currencySymbols.ILS},
  {code: 'JMD', name: 'Jamaican Dollar', symbol: currencySymbols.JMD},
  {code: 'KZT', name: 'Kazakhstani Tenge', symbol: currencySymbols.KZT},
  {code: 'KES', name: 'Kenyan Shilling', symbol: currencySymbols.KES},
  {code: 'KWD', name: 'Kuwaiti Dinar', symbol: currencySymbols.KWD},
  {code: 'LAK', name: 'Lao Kip', symbol: currencySymbols.LAK},
  {code: 'LBP', name: 'Lebanese Pound', symbol: currencySymbols.LBP},
  {code: 'LRD', name: 'Liberian Dollar', symbol: currencySymbols.LRD},
  {code: 'MKD', name: 'Macedonian Denar', symbol: currencySymbols.MKD},
  {code: 'MYR', name: 'Malaysian Ringgit', symbol: currencySymbols.MYR},
  {code: 'MUR', name: 'Mauritian Rupee', symbol: currencySymbols.MUR},
  {code: 'MDL', name: 'Moldovan Leu', symbol: currencySymbols.MDL},
  {code: 'MNT', name: 'Mongolian Tögrög', symbol: currencySymbols.MNT},
  {code: 'MAD', name: 'Moroccan Dirham', symbol: currencySymbols.MAD},
  {code: 'NAD', name: 'Namibian Dollar', symbol: currencySymbols.NAD},
  {code: 'NPR', name: 'Nepalese Rupee', symbol: currencySymbols.NPR},
  {code: 'NIO', name: 'Nicaraguan Córdoba', symbol: currencySymbols.NIO},
  {code: 'NGN', name: 'Nigerian Naira', symbol: currencySymbols.NGN},
  {code: 'OMR', name: 'Omani Rial', symbol: currencySymbols.OMR},
  {code: 'PKR', name: 'Pakistani Rupee', symbol: currencySymbols.PKR},
  {code: 'PAB', name: 'Panamanian Balboa', symbol: currencySymbols.PAB},
  {code: 'PYG', name: 'Paraguayan Guarani', symbol: currencySymbols.PYG},
  {code: 'PEN', name: 'Peruvian Sol', symbol: currencySymbols.PEN},
  {code: 'PHP', name: 'Philippine Peso', symbol: currencySymbols.PHP},
  {code: 'PLN', name: 'Polish Złoty', symbol: currencySymbols.PLN},
  {code: 'QAR', name: 'Qatari Riyal', symbol: currencySymbols.QAR},
  {code: 'RON', name: 'Romanian Leu', symbol: currencySymbols.RON},
  {code: 'RSD', name: 'Serbian Dinar', symbol: currencySymbols.RSD},
  {code: 'SAR', name: 'Saudi Riyal', symbol: currencySymbols.SAR},
  {code: 'SCR', name: 'Seychellois Rupee', symbol: currencySymbols.SCR},
  {code: 'SLL', name: 'Sierra Leonean Leone', symbol: currencySymbols.SLL},
  {code: 'ZAR', name: 'South African Rand', symbol: currencySymbols.ZAR},
  {code: 'LKR', name: 'Sri Lankan Rupee', symbol: currencySymbols.LKR},
  {code: 'SRD', name: 'Surinamese Dollar', symbol: currencySymbols.SRD},
  {code: 'SYP', name: 'Syrian Pound', symbol: currencySymbols.SYP},
  {code: 'TWD', name: 'New Taiwan Dollar', symbol: currencySymbols.TWD},
  {code: 'TZS', name: 'Tanzanian Shilling', symbol: currencySymbols.TZS},
  {code: 'THB', name: 'Thai Baht', symbol: currencySymbols.THB},
  {
    code: 'TTD',
    name: 'Trinidad and Tobago Dollar',
    symbol: currencySymbols.TTD,
  },
  {code: 'TND', name: 'Tunisian Dinar', symbol: currencySymbols.TND},
  {code: 'TRY', name: 'Turkish Lira', symbol: currencySymbols.TRY},
  {code: 'UGX', name: 'Ugandan Shilling', symbol: currencySymbols.UGX},
  {code: 'UAH', name: 'Ukrainian Hryvnia', symbol: currencySymbols.UAH},
  {
    code: 'AED',
    name: 'United Arab Emirates Dirham',
    symbol: currencySymbols.AED,
  },
  {code: 'UYU', name: 'Uruguayan Peso', symbol: currencySymbols.UYU},
  {code: 'UZS', name: 'Uzbekistani Som', symbol: currencySymbols.UZS},
  {
    code: 'VEF',
    name: 'Venezuelan Bolívar Fuerte',
    symbol: currencySymbols.VEF,
  },
  {code: 'VND', name: 'Vietnamese Đồng', symbol: currencySymbols.VND},
  {code: 'XAF', name: 'CFA Franc BEAC', symbol: currencySymbols.XAF},
  {code: 'XCD', name: 'East Caribbean Dollar', symbol: currencySymbols.XCD},
  {code: 'XOF', name: 'CFA Franc BCEAO', symbol: currencySymbols.XOF},
  {code: 'YER', name: 'Yemeni Rial', symbol: currencySymbols.YER},
  {code: 'ZMW', name: 'Zambian Kwacha', symbol: currencySymbols.ZMW},
  {code: 'ZWL', name: 'Zimbabwean Dollar', symbol: currencySymbols.ZWL},
];

export const currenciesOnly: string[] = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CNY',
  'INR',
  'RUB',
  'AUD',
  'CAD',
  'CHF',
  'HKD',
  'NZD',
  'SEK',
  'KRW',
  'SGD',
  'NOK',
  'MXN',
  'BRL',
  'ALL',
  'AFN',
  'ARS',
  'AWG',
  'AZN',
  'BHD',
  'BBD',
  'BDT',
  'BZD',
  'BMD',
  'BOB',
  'BAM',
  'BWP',
  'BGN',
  'KHR',
  'CVE',
  'CLP',
  'COP',
  'CRC',
  'HRK',
  'CUP',
  'CZK',
  'DKK',
  'DOP',
  'EGP',
  'FJD',
  'GHS',
  'GTQ',
  'HNL',
  'HUF',
  'ISK',
  'IDR',
  'ILS',
  'JMD',
  'KZT',
  'KES',
  'KWD',
  'LAK',
  'LBP',
  'LRD',
  'MKD',
  'MYR',
  'MUR',
  'MDL',
  'MNT',
  'MAD',
  'NAD',
  'NPR',
  'NIO',
  'NGN',
  'OMR',
  'PKR',
  'PAB',
  'PYG',
  'PEN',
  'PHP',
  'PLN',
  'QAR',
  'RON',
  'RSD',
  'SAR',
  'SCR',
  'SLL',
  'ZAR',
  'LKR',
  'SRD',
  'SYP',
  'TWD',
  'TZS',
  'THB',
  'TTD',
  'TND',
  'TRY',
  'UGX',
  'UAH',
  'AED',
  'UYU',
  'UZS',
  'VEF',
  'VND',
  'XAF',
  'XCD',
  'XOF',
  'YER',
  'ZMW',
  'ZWL',
];

/**
 * Get currency symbol from currency code
 * @param currencyCode The currency code (e.g., 'USD', 'EUR')
 * @returns The currency symbol or the original code if not found
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  if (!currencyCode) return '';
  return currencySymbols[currencyCode] || currencyCode;
};

/**
 * Get currency name from currency code
 * @param currencyCode The currency code (e.g., 'USD', 'EUR')
 * @returns The full currency name or the original code if not found
 */
export const getCurrencyName = (currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency ? currency.name : currencyCode;
};

/**
 * Get currency object from currency code
 * @param currencyCode The currency code (e.g., 'USD', 'EUR')
 * @returns The Currency object or undefined if not found
 */
export const getCurrencyByCode = (
  currencyCode: string,
): Currency | undefined => {
  return currencies.find(c => c.code === currencyCode);
};
