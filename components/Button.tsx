type ButtonProps = {
  onClick?: () => void;
  style?: string;
  title: string;
  fillColor?: string;
  fill?: boolean;
  strokeColor?: string;
  hoverColor?: string;
  hoverTitleColor?: string;
  titleColor?: string;
};

/**
 *
 * @param {{onClick: () => void, style: string, title: string, fillColor: string, fill: boolean, strokeColor: string, hoverColor: string, hoverTitleColor: string, titleColor: string}} props
 * @returns {JSX.Element}
 */

const Button = ({
  onClick,
  title,
  style,
  fill=false,
  titleColor = "text-purple",
  fillColor = "bg-transparent",
  strokeColor = "border-purple",
  hoverColor = "hover:bg-purple",
  hoverTitleColor = "hover:text-white",
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`border-[2.5px] rounded-md px-3 py-1 ${style} ${fillColor} ${strokeColor} ${
        !fill && "hover:border-[2.5px]"
      } ${hoverColor} ${hoverTitleColor} font-lato ${titleColor}`}
    >
      {title}
    </button>
  );
};

export default Button;
