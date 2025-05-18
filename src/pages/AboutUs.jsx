import React from "react";

export default function AboutUs() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-aqua-blue">
          About AquaNexus
        </h1>
        <p className="mb-4 text-lg text-gray-700">
          AquaNexus is Kenya’s leading platform connecting individuals and
          organizations to trusted water solution providers. Our mission is to
          make access to clean, sustainable water solutions easy, transparent,
          and reliable for everyone.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2 text-aqua-teal">
          Our Story
        </h2>
        <p className="mb-4 text-gray-700">
          Founded by a team passionate about water sustainability, AquaNexus was
          created to bridge the gap between clients seeking rainwater harvesting
          and borehole drilling services and certified, vetted providers. We
          believe in empowering communities and supporting local businesses.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2 text-aqua-teal">
          Why Choose Us?
        </h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>Certified and vetted providers</li>
          <li>Transparent bidding and hiring process</li>
          <li>Secure payments and project management</li>
          <li>Support for both urban and rural communities</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2 text-aqua-teal">
          Contact
        </h2>
        <p className="text-gray-700">
          Email:{" "}
          <a
            href="mailto:support@aquanexus.ke"
            className="text-aqua-blue underline"
          >
            support@aquanexus.ke
          </a>
          <br />
          Phone: +254 700 000 000
          <br />
          Nairobi, Kenya
        </p>
      </div>
    </section>
  );
}
