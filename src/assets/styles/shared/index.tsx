// themeUtils.js
const getButtonStyle = (theme: string) => {
  return `relative overflow-hidden border z-10 transition-colors duration-300 before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:z-[-1] before:transition-all before:duration-700 before:ease-in-out hover:before:w-full hover:cursor-pointer ${theme === "dark"
    ? "bg-[#264653] border-[#E9C46A] text-gray-100 hover:text-gray-950 hover:font-extrabold hover:border-[#5855D6] before:bg-[#E9C46A]"
    : "bg-gray-100 border-[#5855D6] text-gray-950 hover:text-gray-100 hover:border-[#E9C46A] before:bg-[#5855D6]"}`;
};

const getBaseInputStyle = () => {
  return `block w-full py-2 mt-2 font-bold rounded-full pl-10 pr-4 focus:ring focus:outline-none focus:ring-opacity-40 border-3`;
};
const getBtnBase = () => {
  return `px-6 py-3 rounded-full shadow transition-colors transform relative overflow-hidden before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:z-[-1] before:transition-all before:duration-700 before:ease-in-out hover:before:w-full`;
};
export { getBtnBase, getBaseInputStyle, getButtonStyle }