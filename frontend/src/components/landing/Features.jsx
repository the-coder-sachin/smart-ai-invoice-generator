import { ArrowRight } from "lucide-react";
import { FEATURES } from "../../utils/data";

const Features = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">
            Powerful Features to run Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to <span className="text-green-700 font-semibold">manage invoicing</span> and get paid.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-sky-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-16 h-16 mx-auto bg-sky-200 rounded-2xl flex items-center justify-center mb-6">
                <div>
                  <feature.icon />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                {feature.description}
              </p>
              <a
                href="#"
                className="inline-flex items-center text-blue-800 font-medium mt-4 hover:text-black transition-colors duration-200"
              >
                learn more <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
