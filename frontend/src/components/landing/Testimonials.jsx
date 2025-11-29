import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../../utils/data";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-800 font-extrabold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are <span className="text-blue-800 font-semibold">Trusted</span> by, Many Small{" "}
            <span className="text-rose-800 font-semibold">Business Owners</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-sky-100 rounded-2xl p-8 shadow-sm hover:shadow-lg relative transition-all duration-300"
            >
              <div className="absolute -top-4 left-4 w-8 h-8 bg-gradient-to-bl from-blue-950 to-blue-800 text-white rounded-full flex items-center justify-center">
                <Quote className="w-5 h-5" />
              </div>
              <p className="text-gray-600 italic leading-relaxed mb-6 text-lg">
                {testimonial.quote}
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full border-2 border-gray-100 shadow-sm"
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-semibold">
                  {testimonial.author}
                </p>
                <p className="text-gray-600 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
