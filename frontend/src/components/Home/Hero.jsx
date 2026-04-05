import { useAuth } from "../../context/AuthContext";
import { APP_CONFIG, ROUTES } from "../../utils/constants";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck } from "lucide-react";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-300 via-indigo-50 to-purple-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>

        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animate-delay-2000"></div>
        <div className="absolute top-1/2 l-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply blur-xl opacity-20 animate-blob animate-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-200 rounded-full text-blue-800 text-sm font-medium mb-8">
            <Rocket size={16} strokeWidth={3} className="w-4 h-4 mr-2 " />
            {APP_CONFIG.HOME_CONTENT.HERO.BADGE_TEXT}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight md:leading-[1.3]">
            {APP_CONFIG.HOME_CONTENT.HERO.HEADING}
            <span className=" h-auto block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {APP_CONFIG.HOME_CONTENT.HERO.HEADING_HIGHLIGHT}
            </span>
          </h1>

          <p className="text-xl md-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            {APP_CONFIG.HOME_CONTENT.HERO.SUBHEADING}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center">
            {isAuthenticated ? (
              <Link
                to={ROUTES.DASHBOARD}
                className="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg transtion-all transform hover:scale-105 flex items-center"
              >
                {APP_CONFIG.HOME_CONTENT.HERO.CTA_AUTHENTICATED}
                <ArrowRight size={16} strokeWidth={3} className="ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg transtion-all transform hover:scale-105 flex items-center"
                >
                  {APP_CONFIG.HOME_CONTENT.HERO.CTA_PRIMARY}
                  <ArrowRight size={20} strokeWidth={3} className="ml-2" />
                </Link>

                <Link
                  to={ROUTES.LOGIN}
                  className="ml-4 px-8 py-4 bg-white text-blue-600 border-2 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg"
                >
                  {APP_CONFIG.HOME_CONTENT.HERO.CTA_SECONDARY}
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-600">
            {APP_CONFIG.TRUST_INDICATORS.map((indicator, index) => (
              <div key={index} className="flex items-center">
                <CircleCheck
                  size={16}
                  strokeWidth={3}
                  className="w-5 h-5 text-green-500 mr-2"
                />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
