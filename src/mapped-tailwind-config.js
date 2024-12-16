const em = (value) => value / 16 + "em";

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      screens: {
         xxs: em(320),
         xs: em(375),
         sm: em(480),
         md: em(600),
         lg: em(769),
         vl: em(1024),
         xl: em(1240),
         xxl: em(1560),
      },
      colors: {
         text: "var(--color-text-default)", // text-default
         textAccent: "var(--color-text-accent)",
         textInverted: "var(--color-text-inverted)",
         textDisabled: "var(--color-text-disabled)",
         textSuccess: "var(--color-text-success)",
         textSubtle: "var(--color-text-less)",
         textError: "var(--color-text-error)",

         link: "var(--color-link-default)", // text-link
         linkDisabled: "var(--color-link-disabled)", // text-link-disabled
         linkHovered: "var(--color-link-hover)",
         linkInverted: "var(--color-link-inverted)",
         linkInvertedDisabled: "var(--color-link-disabled)",
         linkInvertedHovered: "var(--color-link-hovered)",

         borderLess: "var(--color-border-less)", // border-less
         borderAccent: "var(--color-border-default)", // border-default
         borderAccentLess: "var(--color-border-less)", // border-less
         borderAccentSuccess: "var(--color-border-success)", // border-success
         borderAccentError: "var(--color-border-error)", // border-error

         background: "var(--color-background-default)", // bg-default
         backgroundMore: "var(--color-background-more)",
         backgroundMost: "var(--color-background-most)",
         backgroundBrand: "var(--color-background-brand)",
         backgroundBrandLess: "var(--color-background-brand-less)",
         backgroundAccent: "var(--color-background-accent)",
         backgroundAccentLess: "var(--color-background-accent-less)",
         backgroundAccentMore: "var(--color-background-accent-more)",
         backgroundDark: "var(--color-background-dark)",
         backgroundError: "var(--color-background-error)",
         backgroundSuccess: "var(--color-background-success)",
         backgroundSuccessMore: "var(--color-background-success-more)",
         backgroundWarning: "var(--color-background-warning)",
         backgroundWarningMore: "var(--color-background-warning-more)",

         price: "var(--color-price-default)",

         actionPrimaryText: "var(--color-button-primary-text-default)",
         actionPrimaryTextActive: "var(--color-button-primary-text-active)",
         actionPrimaryTextDisabled: "var(--color-button-primary-text-disabled)",
         actionPrimaryTextHovered: "var(--color-button-primary-text-hovered)",
         actionPrimaryBackground: "var(--color-button-primary-bg-default)",
         actionPrimaryBackgroundActive: "var(--color-button-primary-bg-active)",
         actionPrimaryBackgroundDisabled:
            "var(--color-button-primary-bg-disabled)",
         actionPrimaryBackgroundHovered:
            "var(--color-button-primary-bg-hovered)",
         actionPrimaryBorder: "var(--color-button-primary-border-default)",
         actionPrimaryBorderActive: "var(--color-button-primary-border-active)",
         actionPrimaryBorderDisabled:
            "var(--color-button-primary-border-disabled)",
         actionPrimaryBorderHovered:
            "var(--color-button-primary-border-hovered)",

         actionSecondaryText: "var(--color-button-secondary-text-default)",
         actionSecondaryTextActive: "var(--color-button-secondary-text-active)",
         actionSecondaryTextDisabled:
            "var(--color-button-secondary-text-disabled)",
         actionSecondaryTextHovered:
            "var(--color-button-secondary-text-hovered)",
         actionSecondaryBackground: "var(--color-button-secondary-bg-default)",
         actionSecondaryBackgroundActive:
            "var(--color-button-secondary-bg-active)",
         actionSecondaryBackgroundDisabled:
            "var(--color-button-secondary-bg-disabled)",
         actionSecondaryBackgroundHovered:
            "var(--color-button-secondary-bg-hovered)",
         actionSecondaryBorder: "var(--color-button-secondary-border-default)",
         actionSecondaryBorderActive:
            "var(--color-button-secondary-border-active)",
         actionSecondaryBorderDisabled:
            "var(--color-button-secondary-border-disabled)",
         actionSecondaryBorderHovered:
            "var(--color-button-secondary-border-hovered)",

         actionInvertedText: "var(--color-button-inverted-text-default)",
         actionInvertedTextActive: "var(--color-button-inverted-text-active)",
         actionInvertedTextDisabled:
            "var(--color-button-inverted-text-disabled)",
         actionInvertedTextHovered: "var(--color-button-inverted-text-hovered)",
         actionInvertedBackground: "var(--color-button-inverted-bg-default)",
         actionInvertedBackgroundActive:
            "var(--color-button-inverted-bg-active)",
         actionInvertedBackgroundDisabled:
            "var(--color-button-inverted-bg-disabled)",
         actionInvertedBackgroundHovered:
            "var(--color-button-inverted-bg-hovered)",
         actionInvertedBorder: "var(--color-button-inverted-border-default)",
         actionInvertedBorderActive:
            "var(--color-button-inverted-border-active)",
         actionInvertedBorderDisabled:
            "var(--color-button-inverted-border-disabled)",
         actionInvertedBorderHovered:
            "var(--color-button-inverted-border-hovered)",

         actionTransparentText: "var(--color-button-transparent-text-default)",
         actionTransparentTextActive:
            "var(--color-button-transparent-text-active)",
         actionTransparentTextDisabled:
            "var(--color-button-transparent-text-disabled)",
         actionTransparentTextHovered:
            "var(--color-button-transparent-text-hovered)",
         actionTransparentBackground:
            "var(--color-button-transparent-bg-default)",
         actionTransparentBackgroundActive:
            "var(--color-button-transparent-bg-active)",
         actionTransparentBackgroundDisabled:
            "var(--color-button-transparent-bg-disabled)",
         actionTransparentBackgroundHovered:
            "var(--color-button-transparent-bg-hovered)",
         actionTransparentBorder:
            "var(--color-button-transparent-border-default)",
         actionTransparentBorderActive:
            "var(--color-button-transparent-border-active)",
         actionTransparentBorderDisabled:
            "var(--color-button-transparent-border-disabled)",
         actionTransparentBorderHovered:
            "var(--color-button-transparent-border-hovered)",

         activeIconFull: "var(--color-icon-accent-brand-less)",

         availabilityInStock: "var(--color-availability-in-stock)",
         availabilityOutOfStock: "var(--color-availability-out-of-stock)",

         openingStatusOpen: "var(--color-opening-status-open)",
         openingStatusClosed: "var(--color-opening-status-closed)",
         openingStatusOpenToday: "var(--color-opening-status-open-today)",

         inputText: "var(--color-input-text-default)",
         inputTextActive: "var(--color-input-text-active)",
         inputTextDisabled: "var(--color-input-text-disabled)",
         inputTextHovered: "var(--color-input-text-hover)",
         inputTextInverted: "var(--color-text-inverted)",
         inputPlaceholder: "var(--color-input-placeholder-defaul)",
         inputPlaceholderActive: "var(--color-input-placeholder-active)",
         inputPlaceholderDisabled: "var(--color-input-placeholder-disabled)",
         inputPlaceholderHovered: "var(--color-input-placeholder-hover)",
         inputBackground: "var(--color-input-bg-default)",
         inputBackgroundActive: "var(--color-input-bg-active)",
         inputBackgroundDisabled: "var(--color-input-bg-disabled)",
         inputBackgroundHovered: "var(--color-input-bg-hover)",
         inputBorder: "var(--color-input-border-default)",
         inputBorderActive: "var(--color-input-border-active)",
         inputBorderDisabled: "var(--color-input-border-disabled)",
         inputBorderHovered: "var(--color-input-border-hover)",
         inputError: "var(--color-input-border-error)",

         tableBackground: "var(--color-table-bg-default)",
         tableBackgroundContrast: "var(--color-table-bg-contrast)",
         tableBackgroundHeader: "var(--color-table-bg-header)",
         tableText: "var(--color-text-default)",
         tableTextHeader: "var(--color-text-inverted)",

         // todo deprecate??
         tableCross: "#A3ACBD",
         tableCrossHover: "#7892BC",
         tableCrossHoverBg: "#FAFAFA",

         labelLinkText: "var(--color-tag-dark-text-default)",
         labelLinkTextActive: "var(--color-tag-dark-text-active)",
         labelLinkTextDisabled: "var(--color-tag-dark-text-disabled)",
         labelLinkTextHovered: "var(--color-tag-dark-text-hovered)",
         labelLinkBackground: "var(--color-tag-dark-bg-default)",
         labelLinkBackgroundActive: "var(--color-tag-dark-bg-active)",
         labelLinkBackgroundDisabled: "var(--color-tag-dark-bg-disabled)",
         labelLinkBackgroundHovered: "var(--color-tag-dark-bg-hovered)",
         labelLinkBorder: "var(--color-tag-dark-border-default)",
         labelLinkBorderActive: "var(--color-tag-dark-border-active)",
         labelLinkBorderDisabled: "var(--color-tag-dark-border-disabled)",
         labelLinkBorderHovered: "var(--color-tag-dark-border-hovered)",

         imageOverlay: "rgba(201, 201, 201, 0.5)", // depreacted
         overlay: "rgba(37, 40, 61, 0.5)",
         transparent: "transparent",
      },
      fontFamily: {
         default: ["var(--font-inter)"],
         secondary: ["var(--font-raleway)"],
      },
      zIndex: {
         hidden: -1000,
         base: 0,
         flag: 10, // due to cypress tests
         above: 11,
         menu: 1010,
         overlay: 1030,
         cart: 6000,
         aboveOverlay: 10001,
         maximum: 10100,
      },
      extend: {
         lineHeight: {
            DEFAULT: 1.3,
         },
         fontSize: {
            clamp: "clamp(16px, 4vw, 22px)",
            zero: [0, 0],
         },
         borderRadius: {
            DEFAULT: "0.1875rem",
         },
         keyframes: {
            fadeIn: {
               "0%": { opacity: 0.25 },
               "100%": { opacity: 1 },
            },
         },
         animation: {
            fadeIn: "fadeIn 0.2s ease-in-out",
         },
         spacing: {
            5.5: "1.375rem",
         },
         aspectRatio: {
            "16/11": "16 / 11",
         },
      },
      plugins: [],
   },
};
