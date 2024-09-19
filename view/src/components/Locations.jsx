const Locations = () => {
  return (
    <div className="text-black dark:text-white flex flex-col md:flex-row justify-evenly mx-2 ssm:mx-24">
      <div className=" text-start">
        <h1 className="font-bold text-[3rem] text-center md:text-start">
          Visit our shop
        </h1>
        <h1>
          If you want a special assistance or visit our shop for a discount
          purchase, you can visit us.
        </h1>
        <h1>You will find us in kigali city near Makuza Peace Plaza </h1>
        <h1>
          for more location info, see our locations on{" "}
          <a href="/" className="text-blue-700 hover:underline">
            googleMap
          </a>
        </h1>
      </div>
      <img
        src="./location.png"
        alt="locationImage"
        className="w-[20rem] h-[20rem] rounded-md"
      />
    </div>
  );
};

export default Locations;
