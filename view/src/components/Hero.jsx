const Hero = () => {
  return (
    <div className="bg-[#CFC6B8] dark:bg-black text-black font-lato dark:text-white flex flex-col h-screen p-5 lg:flex-row items-center justify-evenly space-x-5">
      <div className="flex flex-col justify-center lg:justify-normal text-center lg:text-start max-w-[50rem] p-0 sm:p-3 space-y-3">
        <div className="font-extrabold text-[2rem] sm:text-[3rem]">
          <h1>Explore, shop</h1>
          <h1>repeat again.</h1>
        </div>
        <h1>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A mollitia
          obcaecati aliquam iure earum esse! Mollitia quibusdam magnam in
          laudantium.
        </h1>
        <div className="flex justify-center lg:justify-start">
          <button className="bg-green-900 p-5 py-2 p  text-white rounded-full">
            Shop Now
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <img src="./hero.png" alt="heroImage" />
      </div>
    </div>
  );
};

export default Hero;
