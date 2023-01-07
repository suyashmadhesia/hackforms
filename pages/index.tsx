
import Home from "../components/Home";
import Navbar from "../components/Navbar";


export default function Index() {

  // const ConnectWalletButton = dynamic(
  //   () => import('../components/ConnectWalletButton'),
  //   {ssr: false}
  // )

  return (
    <div>
       <div>
        <Navbar />
        <Home />
      </div>
    </div>
  );
}
