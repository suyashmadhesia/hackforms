type Props = {
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextareaChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  placeHolder?: string;
  style?: string;
  multiline?: boolean;
};

// TODO: Create auto-resize textarea

const Answer = ({
  handleInputChange,
  placeHolder = "Type your answer..",
  name,
  style = "text-lg",
  multiline = false,
  handleTextareaChange,
}: Props) => {
  return (
    <>
      {!multiline ? (
        <input
          className={`focus:border-primary border-[3px] rounded-md py-1 px-2 focus:outline-none text-primary border-grey font-raleway ${style}`}
          type="text"
          placeholder={placeHolder}
          onChange={handleInputChange}
          name={name}
        />
      ) : (
        <textarea
          className={`focus:border-primary resize-none border-[3px] rounded-md py-1 px-2 focus:outline-none text-primary border-grey font-raleway ${style}`}
          placeholder={placeHolder}
          onChange={handleTextareaChange}
          name={name}
        />
      )}
    </>
  );
};

export default Answer;
