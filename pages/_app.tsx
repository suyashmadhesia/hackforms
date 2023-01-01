import "../styles/globals.css";
import "survey-core/defaultV2.min.css";
import 'survey-core/modern.min.css';
import "survey-creator-core/survey-creator-core.min.css";
import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { wrapper } from "../store";



function App({ Component, pageProps }: AppProps) {
  return (<Component {...pageProps} />);
}

export default wrapper.withRedux(App);