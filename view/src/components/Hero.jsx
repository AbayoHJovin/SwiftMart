const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Discover Your <span className="text-green-600">Perfect Style</span> in Our Collection
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Explore our curated selection of premium fashion items. New arrivals every week and exclusive deals for our members.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a href="/shop/Unisex/pants">
              <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Shop Now
              </button>
            </a>
            <a href="/signup">
              <button className="px-8 py-4 border-2 border-green-600 text-green-600 hover:text-white hover:bg-green-600 dark:text-white text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105">
                Join Us
              </button>
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12 text-center lg:text-left">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">2-4 business days</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Free Returns</h3>
              <p className="text-gray-600 dark:text-gray-400">30 days guarantee</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-400">100% protected</p>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 relative">
          <div className="relative aspect-square max-w-2xl mx-auto">
            <img
              src="/heroImage.png"
              alt="Fashion Collection"
              className="object-cover w-full h-full rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-80 h-80 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-8 -left-8 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-8 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform -rotate-6">
            <p className="text-green-600 font-semibold">New Arrivals! 🌟</p>
          </div>
          <div className="absolute bottom-8 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform rotate-6">
            <p className="text-green-600 font-semibold">10% Off First Order</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
