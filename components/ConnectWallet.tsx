import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface MethodButtonProps {
  title: string;
  onClick?: () => void;
  icon: string;
}

function MethodButton({ title, onClick, icon }: MethodButtonProps) {
  return (
    <div className="my-5">
      <button
        onClick={onClick}
        className="w-full border-[2.5px] rounded-md px-3 py-2 bg-transparent hover:border-primary border-grey"
      >
        <div className="flex items-center">
          <Image width="30" height="30" src={icon} alt={title} />
          <h3 className="text-primary font-lato mx-2">{title}</h3>
        </div>
      </button>
    </div>
  );
}

function ConnectWallet() {
  return (
    <div
      style={{
        background: "rgb(0 0 0 / 19%);",
      }}
      className="w-screen overflow-hidden fixed h-screen flex justify-center items-center"
    >
      <div className="w-1/2 bg-white h-2/3 flex rounded-xl">
        <div className="w-1/3">
          <button
            onClick={() => {}}
            className="rounded-full my-4 mx-8 p-4 hover:bg-gray-200 bg-transparent"
          >
            <ArrowBackIcon />
          </button>
        </div>
        <div className="w-full items-center flex">
          <div>
            <h1 className="text-5xl text-primary font-lato">Welcome!</h1>
            <h3 className="text-grey font-lato">
              Choose how you want to connect. There are several
              <br /> methods of sign-ups.
            </h3>
            <MethodButton
              title="Social Login or Wallet"
              icon="/assets/web3AuthIcon.png"
            />
            <MethodButton
              title="Unstoppable Domain"
              icon="/assets/unstoppableIcon.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectWallet;
