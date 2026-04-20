import img16 from "../../assets/about1_1.webp";
import img17 from "../../assets/about1_2.webp";
import img18 from "../../assets/borcen-store-newdemo.myshopify.com.svg";
import img19 from "../../assets/borcen-store-newdemo.myshopify.com (1).svg";
import img20 from "../../assets/borcen-store-newdemo.myshopify.com (2).svg";

import "./about.css";
import Newsletter from "../../components/Newsletter";

const features = [
  {
    id: 1,
    title: "Design",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum sunt repudiandae animi, harum dolores tempore tenetur maxime voluptate. Tenetur, delectus!",
    image: img18,
  },
  {
    id: 2,
    title: "Inovation",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum sunt repudiandae animi, harum dolores tempore tenetur maxime voluptate. Tenetur, delectus!",
    image: img19,
  },
  {
    id: 3,
    title: "Journey",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum sunt repudiandae animi, harum dolores tempore tenetur maxime voluptate. Tenetur, delectus!",
    image: img20,
  },
];

const About = () => {
  return (
    <div className="about-page ">
      <div className="w-full breadcrumb-image h-[200px] sm:h-[300px] lg:h-[500px]"></div>

      <div className="py-10 px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-20">
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <h1 className="text-lg  lg:text-4xl font-playfair">Our Story</h1>
            <p className="about-p tracking-wide  flex items-center gap-5 text-left mt-5 text-[#00000080] leading-6 sm:leading-7 text-md lg:text-xl ">
              THE HIGH STRESS FAVOUTIRE
            </p>
            <p className="text-left mt-5 text-[#00000080] leading-6 sm:leading-7 text-sm  lg:text-lg">
              Praesent metus tellus, elementum eu, semper a, adipiscing nec,
              purus. Vestibulum volutpat pretium libero. In ut quam vitae odio
              lacinia tincidunt. Etiam ut purus mattis mauris sodales aliquam.
              Aenean massa. In dui magna, posuere eget, vestibulum et, tempor
              auctor, justo. Vivamus consectetuer hendrerit lacus. In hac
              habitasse platea dictumst. Ut tincidunt tincidunt erat. Lorem
              ipsum dolor sit amet, consectetuer adipiscing elit.
            </p>
          </div>
          <div className="w-full lg:w-1/2 overflow-hidden rounded-lg group">
            <img
              src={img16}
              alt=""
              className="w-full sm:h-[400px] 2xl:h-[500px] object-cover rounded-lg transition-transform duration-1000 group-hover:scale-90"
            />
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 overflow-hidden rounded-lg group">
            <img
              src={img17}
              alt=""
              className="w-full sm:h-[400px] 2xl:h-[500px] object-cover rounded-lg transition-transform duration-1000 group-hover:scale-90"
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <h1 className="text-lg  lg:text-4xl font-playfair">Who We Are ?</h1>
            <p className="about-p  tracking-wide flex items-center gap-5 text-left mt-5 text-[#00000080] leading-6 sm:leading-7 text-md lg:text-xl">
              THE HIGH STRESS FAVOUTIRE
            </p>
            <p className="text-left mt-5 text-[#00000080] leading-6 sm:leading-7 text-sm  lg:text-lg">
              Praesent metus tellus, elementum eu, semper a, adipiscing nec,
              purus. Vestibulum volutpat pretium libero. In ut quam vitae odio
              lacinia tincidunt. Etiam ut purus mattis mauris sodales aliquam.
              Aenean massa. In dui magna, posuere eget, vestibulum et, tempor
              auctor, justo. Vivamus consectetuer hendrerit lacus. In hac
              habitasse platea dictumst. Ut tincidunt tincidunt erat. Lorem
              ipsum dolor sit amet, consectetuer adipiscing elit.
            </p>
          </div>
        </div>
      </div>
      <section className="py-10 px-4 sm:px-8 lg:px-20 bg-[#f5f5f5] section-about ">
        <div
          className="
    flex items-center justify-center gap-10 flex-wrap
    min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]
  "
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center lg:w-[30%] "
            >
              <img src={feature.image} alt="" className="w-1/5" />
              <h2 className="my-4 text-lg  lg:text-4xl font-semibold">
                {feature.title}
              </h2>
              <div className="w-20 h-[2px] bg-black mb-4"></div>
              <p className="text-sm  lg:text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default About;
