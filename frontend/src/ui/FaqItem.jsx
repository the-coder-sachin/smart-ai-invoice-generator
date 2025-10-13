import { ChevronDown } from "lucide-react";

const FaqItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-6 hover:bg-sky-200 cursor-pointer transition-colors duration-300 ${
          isOpen ? "bg-sky-200" : "bg-sky-100"
        } text-left`}
      >
        <span className="text-lg font-medium pr-4 text-gray-800 ">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
            isOpen && "transform rotate-180"
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-6 text-gray-600 leading-relaxed border-t border-t-sky-200 bg-white ">
          {faq.answer}
        </div>
      )}
    </div>
  );
};

export default FaqItem;
