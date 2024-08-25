const Popular = () => {
  const shoes = [
    {
      name: "shoe1",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe1.png",
    },
    {
      name: "shoe2",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe2.png",
    },
    {
      name: "shoe3",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe3.png",
    },
  ];
  const pants = [
    {
      name: "pant1",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe1.png",
    },
    {
      name: "pant2",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe2.png",
    },
    {
      name: "pant3",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe3.png",
    },
  ];
  const shirts = [
    {
      name: "shirt1",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe1.png",
    },
    {
      name: "shirt2",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe2.png",
    },
    {
      name: "shirt3",
      explanation: "The best shoe ever",
      price: "300$",
      image: "./shoe3.png",
    },
  ];
  return (
    <div className="text-black dark:text-white font-lato p-2 sm:p-5 my-12 mx-0 sm:mx-5">
      <div className="text-[20px] ssm:text-[30px] text-start sssm:text-center sm:text-[3rem] space-y-2 font-extrabold mb-4">
        <h1>Find innovations</h1>
        <h1>Only here</h1>
      </div>
      <div className="text-start sssm:text-center">
        <h1>Our goal is to supply all new collections</h1>
        <h1> in fashion to you</h1>
        <button className="bg-green-900 text-white my-2 p-3 px-5 rounded-md">
          Shop Now
        </button>
      </div>
      <h2 className="text-2xl mx-0 sm:mx-7 my-3 md:text-3xl font-bold mb-4">
        Popular products
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col space-y-10 ssm:flex-row justify-evenly items-center">
          {shoes.map((shoe, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <img
                src={shoe.image}
                alt="shoe1"
                className="w-[10rem] h-[10rem] bg-gray-100 p-5 rounded-full rounded-tr-none"
              />
              <h1 className="font-bold text-xl">{shoe.name}</h1>
              <h1>{shoe.explanation}</h1>
              <h1 className="font-bold">From {shoe.price}</h1>
              <button className="bg-yellow-500 p-2 rounded-full px-5">
                Buy
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-10 ssm:flex-row justify-evenly items-center">
          {pants.map((shoe, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <img
                src={shoe.image}
                alt="shoe1"
                className="w-[10rem] h-[10rem] bg-gray-100 p-5 rounded-full rounded-tr-none"
              />
              <h1 className="font-bold text-xl">{shoe.name}</h1>
              <h1>{shoe.explanation}</h1>
              <h1 className="font-bold">From {shoe.price}</h1>
              <button className="bg-yellow-500 p-2 rounded-full px-5">
                Buy
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-10 ssm:flex-row justify-evenly items-center">
          {shirts.map((shoe, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <img
                src={shoe.image}
                alt="shoe1"
                className="w-[10rem] h-[10rem] bg-gray-100 p-5 rounded-full rounded-tr-none"
              />
              <h1 className="font-bold text-xl">{shoe.name}</h1>
              <h1>{shoe.explanation}</h1>
              <h1 className="font-bold">From {shoe.price}</h1>
              <button className="bg-yellow-500 p-2 rounded-full px-5">
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popular;
