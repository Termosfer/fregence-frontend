import img22 from "../../assets/map.webp";
import { MdLocationOn, MdOutlinePhoneAndroid, MdMail } from "react-icons/md";
import { FaClock } from "react-icons/fa";

import Newsletter from "../../components/Newsletter";
import { toast } from "react-toastify";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../api/axios";
const contactInfo = [
  {
    id: 1,
    icon: MdLocationOn,
    title: "Address",
    text: "Click the icon in the bottom right of the page to talk to our agents during business hours. At other times we will respond as soon as possible.",
  },
  {
    id: 2,
    icon: MdOutlinePhoneAndroid,
    title: "Phone",
    text: "(+84) 1800 68 68",
  },
  {
    id: 3,
    icon: FaClock,
    title: "Open Hours",
    text: "Monday to Friday 09:30 - 17:30",
  },
  {
    id: 4,
    icon: MdMail,
    title: "Email",
    text: "contact@example.com",
  },
];
const Contact = () => {
  // 1. Form state-i
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // 2. TanStack Query Mutation (POST /api/contact)
  const mutation = useMutation({
    mutationFn: (data: typeof formData) => {
      return api.post("/contact", data);
    },
    onSuccess: () => {
      toast.success("Message sent! We'll contact you soon.");
      setFormData({ name: "", email: "", message: "" }); // Formu təmizlə
    },
    onError: (error: any) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Please log in first!");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Token yoxlanışı (Əgər backend mütləq giriş tələb edirsə)
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }

    // Sadə validasiya
    if (!formData.name || !formData.email || !formData.message) {
      toast.warn("Please fill in all fields.");
      return;
    }

    mutation.mutate(formData);
  };
  return (
    <div className="contact-page font-[Playfair]">
      <div className="w-full breadcrumb-image h-[200px] sm:h-[300px] lg:h-[500px]"></div>
      <div className="py-10 px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          <div className="flex flex-col justify-center gap-8 text-left w-full lg:w-1/2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Contact Us
            </h1>

            <p className="text-[#00000080] leading-7 text-sm sm:text-base lg:text-xl max-w-xl">
              If you would like to know more about our policies, you can consult
              our Terms and Conditions. You will also be able to follow your
              order (tracking number will be provided in an e-mail after
              ordering). You wish to return some items? Click here.
            </p>

            <div className="flex flex-col gap-6">
              {contactInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.id} className="flex items-start gap-4">
                    <Icon className="text-xl lg:text-2xl mt-1 shrink-0" />

                    <div className="flex flex-col">
                      <h2 className="text-base lg:text-2xl font-semibold">
                        {item.title}
                      </h2>
                      <p className="text-sm lg:text-lg text-[#00000080] max-w-xl">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <img
              src={img22}
              alt=""
              className="
          w-full
          h-[280px] sm:h-[400px] lg:h-[700px]
          object-cover
          rounded-lg
        "
            />
          </div>
        </div>

        <section className="mt-16 lg:mt-24">
          <h1 className="text-xl lg:text-4xl font-semibold">
            Send Us A Message
          </h1>

          <form
            className="mt-10 flex flex-col gap-6 max-w-4xl mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              <input
                value={formData.name}
                onChange={handleChange}
                disabled={mutation.isPending}
                type="text"
                name="name"
                placeholder="Your Name..."
                className="
            w-full
            text-sm sm:text-base lg:text-xl
            text-[#00000080]
            p-4 sm:p-5
            border border-gray-300
            rounded
            outline-none
          "
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={mutation.isPending}
                type="email"
                placeholder="Your Email..."
                className="
            w-full
            text-sm sm:text-base lg:text-xl
            text-[#00000080]
            p-4 sm:p-5
            border border-gray-300
            rounded
            outline-none
          "
              />
            </div>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={mutation.isPending}
              placeholder="Your Message..."
              rows={8}
              className="
          w-full
          text-sm sm:text-base lg:text-xl
          text-[#00000080]
          p-4 sm:p-5
          border border-gray-300
          rounded
          outline-none
        "
            ></textarea>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="
          bg-black text-white
          text-sm sm:text-base lg:text-xl
          py-3 px-10
          w-48 sm:w-56
          mx-auto
          rounded-lg
          hover:bg-gray-800
          transition
        "
            >
              {mutation.isPending ? "SENDING..." : "SEND"}
            </button>
          </form>
        </section>
      </div>

      <Newsletter />
    </div>
  );
};

export default Contact;
