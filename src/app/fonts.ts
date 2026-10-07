import localFont from "next/font/local";

export const interTight = localFont({
  src: "../../public/fonts/InterTight-Variable.woff2",
  variable: "--font-inter-tight",
  display: "swap",
  weight: "100 900",
});

export const instrumentSerif = localFont({
  src: [
    {
      path: "../../public/fonts/InstrumentSerif-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/InstrumentSerif-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "../../public/fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800",
});
