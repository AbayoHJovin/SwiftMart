const Hero = () => {
  return (
    <div className="relative flex h-screen p-5 bg-[url('./bg-white.png')] dark:bg-[url('./bg-black.png')]  items-center justify-center bg-cover bg-center text-black font-serif dark:text-white">
      <div className="absolute inset-0 bg-black opacity-30 dark:bg-gray-900 dark:opacity-50"></div>{" "}
      <div className="relative filter inset-0 lg:inset-auto backdrop-blur-[1px] h-screen md:h-auto z-10 flex flex-col justify-center lg:justify-start text-center lg:text-start max-w-[45rem] space-y-3">
        <h1 className={`font-extrabold text-3xl sm:text-5xl text-white`}>
          IT&apos;S ALL ABOUT FASHION
        </h1>
        <h2 className="text-xl sm:text-2xl text-white">
          We bring stock to your door!
        </h2>
        <p className="text-lg text-white">
          Buy now and get 10% off on your first purchase!
        </p>

        <div className="flex justify-center lg:justify-start">
          <a href="/shop/Both/pants">
            <button className="bg-green-900 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
              Shop Now
            </button>
          </a>
        </div>
      </div>
      <div className="absolute lg:relative flex justify-center lg:justify-normal mt-5 lg:mt-0">
        <img
          src="./heroImage.png"
          alt="hero"
          className="max-w-full h-auto rounded-lg z-0"
        />
      </div>
    </div>
  );
};

export default Hero;
