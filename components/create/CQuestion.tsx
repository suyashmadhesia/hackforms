type Props = {
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  style?: string;
};

const CQuestion = ({ handleInputChange, name, style = "text-3xl" }: Props) => {
  return (
    <>
      <input
        className={`focus:border-none focus:outline-none border-none outline-none font-raleway ${style}`}
        type="text"
        placeholder="What's on your mind?"
        onChange={handleInputChange}
        name={name}
      />
    </>
  );
};

export default CQuestion;
