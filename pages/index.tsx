import Answer from "../components/common/Answer";
import CQuestion from "../components/create/CQuestion";
import FileUpload from "../components/create/FileUpload";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl">Hello world</h1>
      {/* <Answer name="answer" />
      <CQuestion name="question" /> */}
      <FileUpload />
    </div>
  );
}
