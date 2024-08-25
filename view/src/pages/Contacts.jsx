import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import emailjs from "emailjs-com";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_nfzpwcs",
        "template_slisiu4",
        {
          from_name: formData.name,
          email_id: formData.email,
          message: formData.message,
        },
        "2JC1ozQGy_9hgSnHX"
      )
      .then(
        // eslint-disable-next-line no-unused-vars
        (response) => {
          toast.success("Send. Shortly, you will get a response");
          setFormData({
            name: "",
            email: "",
            message: "",
          });
        },
        // eslint-disable-next-line no-unused-vars
        (err) => {
          toast.error("Failed. Please try again...");
        }
      );
  };

  return (
    <div className="flex flex-col min-h-screen font-lato">
      <Navbar />
      <ToastContainer />
      <main className="flex-grow bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-8">
            Contact Us
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We&apos;d love to hear from you! If you have any questions,
                feedback, or concerns, please feel free to reach out to us.
              </p>
              <div className="text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Email:</strong> support@example.com
                </p>
                <p>
                  <strong>Phone:</strong> (123) 456-7890
                </p>
                <p>
                  <strong>Address:</strong> 123 Main St, Anytown, USA
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-sm font-medium leading-5 text-center text-white capitalize transition-colors duration-200 transform bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:bg-blue-500"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
