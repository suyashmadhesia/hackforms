import Answer from "../components/common/Answer";
import CQuestion from "../components/create/CQuestion";
import FileUpload from "../components/create/FileUpload";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Button from "../components/Button";

export default function Home() {

  return (
    <div className="h-screen">
      <Navbar />
      <div className="my-10 text-5xl font-extrabold font-inter text-primary text-center">
        <p> Create forms, surveys, and quizzes</p>
        <p className="my-2">that people enjoy answering.</p>
      </div>
      <div className="flex justify-center h-auto">
        <Image
          width={"600"}
          height={"350"}
          src="/assets/browser.svg"
          alt="image"
        />
      </div>
      <div className="flex justify-center my-8">
        <Button
          title="Get Started it's free"
          fill={true}
          fillColor="bg-purple"
          titleColor="text-white"
          hoverColor="hover:bg-white"
          hoverTitleColor="hover:text-purple"
        />
      </div>
    </div>
  );
}
