import Link from "next/link";
import Button from "./Button";

type AnchorProps = {
  href: string;
  child: string;
  style?: string;
};

function Anchor({ href, child, style }: AnchorProps) {
  return (
    <Link
      className={`text-[16px] font-lato hover:text-purple hover:font-medium text-grey ${style}`}
      href={href}
    >
      {child}
    </Link>
  );
}

function Navbar() {
  return (
    <div className="px-16 py-8 w-screen flex justify-between items-center">
      <Link href="/" className="text-2xl text-purple font-lato font-extrabold">
        HackForms.
      </Link>
      <div className="flex justify-between w-1/3">
        <Anchor href="/faq" child="FAQ's" />
        <Anchor href="/about" child="About" />
        <Anchor href="/howitworks" child="How it works" />
      </div>
      <div>
        <Button
          title="Connect Wallet"  
        />
      </div>
    </div>
  );
}

export default Navbar;
