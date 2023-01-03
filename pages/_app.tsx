import "../styles/globals.css";
import "survey-core/defaultV2.min.css";
import 'survey-core/modern.min.css';
import "survey-creator-core/survey-creator-core.min.css";
// import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { wrapper } from "../store";
import CustomErrorBoundary from "../components/common/CutomErrorBoundary";
import { useRouter } from "next/router";



function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <CustomErrorBoundary router={router}>
      <Component {...pageProps} />
    </CustomErrorBoundary>
    
  );
}

export default wrapper.withRedux(App);