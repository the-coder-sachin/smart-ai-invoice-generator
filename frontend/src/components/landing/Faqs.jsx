import { useState } from "react"
import { FAQS } from "../../utils/data";
import FaqItem from "../../ui/FaqItem";

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleClick = (index) =>{
        console.log("test");
        
        setOpenIndex( openIndex === index ? null : index);
    }
  return (
    <section id='FAQ' className="py-20 lg:py-28 bg-sky-50 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl mb-4 font-extrabold text-gray-900" >Frequently Asked Questions</h2>
                <p className="text-xl max-w-3xl mx-auto text-gray-600">Everything you need to know about the product and billing</p>
            </div>
            <div className="space-y-4">
                {FAQS.map((faq, index)=> (
                    <FaqItem 
                    key={index}
                    faq={faq}
                    isOpen={openIndex === index}
                    onClick={()=>handleClick(index)}
                    />
                ))}
            </div>
        </div>
    </section>
  )
}

export default Faqs