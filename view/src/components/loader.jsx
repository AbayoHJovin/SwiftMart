// eslint-disable-next-line react/prop-types
const Loader = ({text}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent backdrop:blur-md">
      <div className="flex flex-col items-center">
        <div className="sk-fading-circle">
          <div className="sk-circle1 sk-circle"></div>
          <div className="sk-circle2 sk-circle"></div>
          <div className="sk-circle3 sk-circle"></div>
          <div className="sk-circle4 sk-circle"></div>
          <div className="sk-circle5 sk-circle"></div>
          <div className="sk-circle6 sk-circle"></div>
          <div className="sk-circle7 sk-circle"></div>
          <div className="sk-circle8 sk-circle"></div>
          <div className="sk-circle9 sk-circle"></div>
          <div className="sk-circle10 sk-circle"></div>
          <div className="sk-circle11 sk-circle"></div>
          <div className="sk-circle12 sk-circle"></div>
        </div>
        <h1 className="mt-4 text-black text-lg sm:text-xl md:text-2xl lg:text-3xl">
          {text}
        </h1>
      </div>
    </div>
  );
};

export default Loader;
