import { useState } from "react";
import style from "./styles/FileUpload.module.css";

interface Props {
  title: string;
  desription?: string;
}

// TODO file Upload little bit more customization needed


const FileUpload = () => {
  return (
    <form className="file-field flex flex-col justify-center items-center border-[3px] border-dashed border-primary rounded-xl h-[300px] w-[500px] cursor-pointer">
      <input type="file" />
    </form>
  );
};

export default FileUpload;
