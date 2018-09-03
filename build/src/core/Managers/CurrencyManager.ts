/**
 * @title 					Currency Manager
 * @description 			Handle correct currency formatting.
 * @filename 				CurrencyManager.ts
 * @copyright 				Copyright (c) 2017
 * @company 				SidePlay Entertainment
 * @author 					Keith Roberts <keithroberts@sideplay.com>
 * @date 					2017-05-05
 * @version 				v2.0.1
 */

namespace com.sideplay.core {
    /**
     * @name                ICurrencyFormat
     * @description         Interface for handling currency code data
     */
    export interface ICurrencyFormat {
        ISOCode: string;
        currency: string;
        default: ICurrencyDetail;
        variants: ICurrencyDetail[];
    }

    /**
     * @name                ICurrencyDetail
     * @description         Interface for handling detailed information about currency
     */
    export interface ICurrencyDetail {
        countryCodes: string[];
        mainCountry: string;
        languages: string[];
        minorPresent: boolean;
        majorSymbol: string;
        minorSymbol: string;
        decimalPrecision: number;
        majorDelimiter: string;
        minorDelimiter: string;
        format: string;
    }
    // shorthand format
    // %v - value
    // %m - major symbol (for thousand, million, etc)
    // %n - minor symbol (for pence,cents,etc)
    // %b - both symbols (major and minor), not at the same time.
    // spaces in the shorthand format will be treated as spaces in the formatted string

    export class CurrencyManager {
        public static instance: CurrencyManager = null;

        private _selectedCurrency: string = null; // Selected currency isocode - ISO-4217.
        private _selectedLocale: string = null; // Selected locale - ISO-3166-1-alpha-2.
        private _selectedLanguage: string = null; // Language code, ISO-639.
        private _useISOCode: boolean = null; // Whether to render the ISO code instead of the symbols.
        private _useMinorIfPresent: boolean = null; // Whether the minor symbol should be used by default if prese.
        private _selectedCurrencyData: ICurrencyFormat = null; // All info on the selected currency.
        private _selectedCurrencyDetails: ICurrencyDetail = null; // All details on selected currency.

        private _currencyFileData: ICurrencyFormat[] = null; // All currency information.

        private _gameSupportedCurrencies: string[] = null; // Currencies that the game supports and has assets for.

        /**
         * @name constructor
         * @description                     Its the bloody constructor.
         * @param currency string           The three letter ISO code that describes the currency. Follows ISO 4217.
         * @param useISO boolean            Will the ISO code be used instead of the currency symbol
         * @param useMinorIfPresent boolean Will the minor symbol should be used by default
         * @param supportedByClient         A list of the currencies supported by the client (ISO 4217)
         * @param currencyFileJSON          The currency file information.
         * @param locale                    The selected locale (ISO-3166-1-alpha-2)
         * @param language                  The selected language (ISO-639)
         */
        constructor(currency: string, useISO: boolean, useMinorIfPresent: boolean, supportedByClient: string[], currencyFileJSON: any, locale: string, language: string) {
            if (CurrencyManager.instance === null) {
                if (config.settings.developerMode) {
                    console.group("CurrencyManager.ts");
                    console.log("[CurrencyManager.ts].constructor() Initialising...");
                }
                CurrencyManager.instance = this;
            } else {
                throw new Error("[CurrencyManager] Cannot make 2 instances of CurrencyManager. Please use 'CurrencyManager.instance' instead.");
            }

            // Check that the supplied params are valid and not null...
            if (useISO != null) {
                if (config.settings.developerMode) {
                    console.log("[CurrencyManager.ts].constructor() Use ISO set to", useISO);
                }
                this._useISOCode = useISO;
            } else {
                throw new Error("[CurrencyManager] ISO Symbol preference not defined.");
            }

            if (useMinorIfPresent != null) {
                if (config.settings.developerMode) {
                    console.log("[CurrencyManager.ts].constructor() UseMinorIfPresent set to", useMinorIfPresent);
                }
                this._useMinorIfPresent = useMinorIfPresent;
            } else {
                throw new Error("[CurrencyManager] Minor symbol preference not defined.");
            }

            if (supportedByClient != null && supportedByClient.length > 0) {
                if (config.settings.developerMode) {
                    console.log("[CurrencyManager.ts].constructor() supportedBuClient set to", supportedByClient);
                }
                this._gameSupportedCurrencies = supportedByClient;
            } else {
                throw new Error("[CurrencyManager] List of currencies supported by the game client not defined.");
            }

            if (currencyFileJSON != null) {
                if (config.settings.developerMode) {
                    console.log("[CurrencyManager.ts].constructor() Loading currencyFileJSON");
                }
                this._currencyFileData = currencyFileJSON;
            } else {
                throw new Error("[CurrencyManager] Currency definitions not provided.");
            }

            if (currency != null) {
                currency = currency.toUpperCase();
                if (this._gameSupportedCurrencies.indexOf(currency) !== -1) {
                    // Supported by the client.
                    if (this._checkCurrencySupport(currency) != null) {
                        this._selectedCurrency = currency;
                        this._selectedCurrencyData = this._checkCurrencySupport(currency);

                        if (config.settings.developerMode) {
                            console.log("[CurrencyManager.ts].constructor() Selected currency set to", this._selectedCurrency);
                            console.log("[CurrencyManager.ts].constructor() Selected currency data set to", this._selectedCurrencyData);
                        }
                    } else {
                        throw new Error("[CurrencyManager] Selected currency not supported.");
                    }
                } else {
                    throw new Error("[CurrencyManager] Selected currency not supported by game client.");
                }
            } else {
                throw new Error("Currency string provided as null/undefined. Please provide a currency code.");
            }

            if (locale != null || language != null) {
                if (locale != null) {
                    if (this._checkLocaleSupport(locale)) {
                        this._selectedLocale = locale;
                        if (config.settings.developerMode) {
                            console.log("[CurrencyManager.ts].constructor() Selected locale", locale);
                        }
                    } else {
                        throw new Error("[CurrencyManager] Locale is not supported by the selected currency.");
                    }
                } else if (language != null) {
                    if (this._checkLanguageSupport(language)) {
                        this._selectedLanguage = language;
                        if (config.settings.developerMode) {
                            console.log("[CurrencyManager.ts].constructor() Selected language", language);
                        }
                    } else {
                        console.warn("[CurrencyManager] Language is not defined. Default information for currency " + currency + " will be used instead of any localised options.");
                        this._selectedCurrencyDetails = this._selectedCurrencyData.default;
                        // throw new Error("[CurrencyManager] Language is not supported by the selected currency.");
                    }
                } else {
                    throw new Error("[CurrencyManager] Unreachable point somehow reached. Something is seriously wrong here...");
                }
            } else {
                console.warn("[CurrencyManager] Locale and language are not defined. Default information for currency " + currency + " will be used instead of any localised options.");
                this._selectedCurrencyDetails = this._selectedCurrencyData.default;
                // throw new Error("[CurrencyManager] Locale is not defined.");
            }
        }

        /**
         * @name formatCurrency
         * @description Formats a number into a string
         * @param value The value to format
         * @param ignoreDecimalsWherePossible Ignore decimal values if possible (eg £400 instead of £400.00)
         * @param singleUseMinor Force the string to be in the minor denomination (eg 50p instead of £0.50)
         * @param shrinkToKorM If in English, automatically shrink the value to K or M (eg 700,000 becomes 700K, 1,000,000 becomes 1M, etc)
         * @return string The formatted number
         */
        public formatCurrency(value: number, ignoreDecimalsWherePossible?: boolean, singleUseMinor?: boolean, shrinkToKorM?:boolean): string {
            let decimalPrecision: number = this._selectedCurrencyDetails.decimalPrecision;

            if (ignoreDecimalsWherePossible) {
                if (this._checkIsInt(value)) {
                    decimalPrecision = 0;
                }
            }

            //automatically shrink the value and add "K" or "M"
            var shrinkAppendedCharacter:string = "";
            if(shrinkToKorM && this._selectedLanguage == "en"){
                if(this._checkIsInt(value) && singleUseMinor != true && !this._useMinorIfPresent){
                    if(value >= 1000 && value < 1000000 && this._checkIsInt((value / 1000))){
                        //if the value is greater than or equal to 1,000 and less than 1,000,000 shrink it and use "K"
                        value = value / 1000;
                        shrinkAppendedCharacter = "K";
                        decimalPrecision = 0;
                    } else if (value >= 1000000 && this._checkIsInt((value / 1000000))){
                        //if the value is over 1,000,000 shrink it and use "M"
                        value = value / 1000000;
                        shrinkAppendedCharacter = "M";
                        decimalPrecision = 0;
                    }
                }
            }

            let returnString: string = "" + this._selectedCurrencyDetails.format; // String containing "%m"/"%n"/"%b". Always contains "%v".
            var preppedValue: string = this._prepNumbers(value, decimalPrecision, 3, this._selectedCurrencyDetails.majorDelimiter, this._selectedCurrencyDetails.minorDelimiter);

            preppedValue += shrinkAppendedCharacter;

            if (this._useISOCode) {
                returnString = this._selectedCurrency;
                returnString += " ";
                returnString += preppedValue;
            } else {
                if ((this._selectedCurrencyDetails.minorPresent && this._useMinorIfPresent) || (this._selectedCurrencyDetails.minorPresent && singleUseMinor)) {
                    // The currency supports a minor symbol, eg. pence, cents AND we are using it
                    if (value >= 1) {
                        // Remove %n (minor) if present.
                        returnString = returnString.replace("%n", "");

                        // Replace %b if present with major symbol
                        returnString = returnString.replace("%b", this._selectedCurrencyDetails.majorSymbol);

                        // Replace %m if present with major symbol
                        returnString = returnString.replace("%m", this._selectedCurrencyDetails.majorSymbol);

                        // Replace %v with the prepared value.
                        returnString = returnString.replace("%v", preppedValue);
                    } else {
                        // Remove the %m (major) if present.
                        returnString = returnString.replace("%m", "");

                        // Replace the %b if present with minorSymbol.
                        returnString = returnString.replace("%b", this._selectedCurrencyDetails.minorSymbol);

                        // Replace the %n if present.
                        returnString = returnString.replace("%n", this._selectedCurrencyDetails.minorSymbol);

                        // Replace %v with an upscaledValue.
                        returnString = returnString.replace("%v", this._upscaleMinors(value));
                    }
                } else {
                    // No minor symbol.
                    // Remove %n (minor) if present.
                    returnString = returnString.replace("%n", "");

                    // Replace %b if present with major symbol.
                    returnString = returnString.replace("%b", this._selectedCurrencyDetails.majorSymbol);

                    // Replace %m if present with major symbol.
                    returnString = returnString.replace("%m", this._selectedCurrencyDetails.majorSymbol);

                    // Replace %v with the prepared value.
                    returnString = returnString.replace("%v", preppedValue);
                }
            }
            // console.log("Formatted " + value + " to " + returnString);
            return returnString;
        }

        /**
         * @name _checkCurrencySupport
         * @description Checks support for a currency using a provided ISOCode string
         * @param ISOCode string The ISO code of the currency (ISO-4217)
         * @return boolean Whether the currency is supported or not.
         */
        private _checkCurrencySupport(ISOCode: string): ICurrencyFormat {
            for (const data of this._currencyFileData) {
                if (data.ISOCode === ISOCode) {
                    return data;
                }
            }
            return null;
        }

        /**
         * @name _checkLocaleSupport
         * @description Checks support for a locale in the selected currency.
         * @param locale The locale (country code)(ISO-3166-1-alpha-2), uppercase
         * @return boolean Whether the locale is supported.
         */
        private _checkLocaleSupport(locale: string): boolean {
            // Check any variants if present. these have priority over the default.
            for (const variant of this._selectedCurrencyData.variants) {
                if (variant.countryCodes.indexOf(locale) !== -1) {
                    this._selectedCurrencyDetails = variant;
                    return true;
                }
            }

            // Check the default country code.
            if (this._selectedCurrencyData.default.countryCodes.indexOf(locale) !== -1) {
                this._selectedCurrencyDetails = this._selectedCurrencyData.default;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name _checkLanguageSupport
         * @description Checks suppoer for a language in the selected currency
         * @param language The language string (ISO-639), lowercase
         * @return boolean Whether the language is supported.
         */
        private _checkLanguageSupport(language: string): boolean {
            // Check any variants if present. these have priority over the default.
            for (const variant of this._selectedCurrencyData.variants) {
                if (variant.languages.indexOf(language) !== -1) {
                    this._selectedCurrencyDetails = variant;
                    return true;
                }
            }

            // Check the default section for a matching language.
            if (this._selectedCurrencyData.default.languages.indexOf(language) !== -1) {
                this._selectedCurrencyDetails = this._selectedCurrencyData.default;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name                    _prepNumbers
         * @description             Prepare the numbers for the addition of the currency symbol.
         * @note                    Number.prototype.format(n, x, s, c) - VisioN on stackoverflow
         * @param n                 Length of decimal
         * @param x                 Length of whole part
         * @param s                 Sections delimiter
         * @param c                 Decimal delimiter
         * @return                  Formatted number
         */
        private _prepNumbers(numIn: number, n: number, x: number, s: string, c: string): string {
            const re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\D" : "$") + ")";
            const num = numIn.toFixed(Math.max(0, ~~n));
            return (c ? num.replace(".", c) : num).replace(new RegExp(re, "g"), "$&" + (s || ","));
        }

        /**
         * @name                    _checkIsInt
         * @description             Check whether a value provided is an integer or not.
         * @note                    Number.isInteger() equivalent. Added here in case it is not supported natively in a browser.
         * @param value             Value for verification
         * @return                  True if is a number, finite and if the Math.floor of the value equals the value.
         */
        private _checkIsInt(value: number): boolean {
            return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
        }

        /**
         * @name _upscaleMinors
         * @description Upscale minor values so that they can be used with a minor symbol (eg £0.50 to 50p)
         * @param number Value to scale up
         * @return string The upscaled value as a string
         */
        private _upscaleMinors(value: number): string {
            let scaleMultiplier: number;
            switch (this._selectedCurrencyDetails.decimalPrecision) {
                case 0:
                    scaleMultiplier = 1;
                    break;
                case 1:
                    scaleMultiplier = 10;
                    break;
                case 2:
                    scaleMultiplier = 100;
                    break;
                case 3:
                    scaleMultiplier = 1000;
                    break;
                default:
                    throw new Error("[CurrencyManager]: Something went wrong... Minor currency value scale factor incorrect.");
            }

            return (value * scaleMultiplier).toString();
        }
    }
}
