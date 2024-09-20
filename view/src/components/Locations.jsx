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
          <a
            href="https://www.google.com/maps/place/Makuza+Peace+Plaza/@-1.9465656,30.0569905,925m/data=!3m2!1e3!4b1!4m6!3m5!1s0x19dca4240db7b3f5:0x5256fd511623ef15!8m2!3d-1.9465656!4d30.0595654!16s%2Fg%2F11c1nfd6s8!5m1!1e2?entry=ttu&g_ep=EgoyMDI0MDkxNi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            className="text-blue-700 hover:underline"
          >
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
