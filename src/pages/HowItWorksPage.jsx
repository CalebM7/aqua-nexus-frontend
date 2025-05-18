import React from "react";

export default function HowItWorksPage() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-aqua-blue">How It Works</h1>
        <ol className="list-decimal pl-6 text-gray-700 mb-8 space-y-4">
          <li>
            <span className="font-semibold text-aqua-teal">
              Post Your Project:
            </span>
            <br />
            Describe your rainwater harvesting or borehole drilling needs.
            Provide details such as location, budget, and any special
            requirements.
          </li>
          <li>
            <span className="font-semibold text-aqua-teal">
              Receive and Compare Bids:
            </span>
            <br />
            Certified providers will review your project and submit competitive
            bids. You can compare their profiles, ratings, and reviews.
          </li>
          <li>
            <span className="font-semibold text-aqua-teal">
              Hire the Best Provider:
            </span>
            <br />
            Choose the provider that best fits your needs and budget. All
            providers are vetted for quality and reliability.
          </li>
          <li>
            <span className="font-semibold text-aqua-teal">
              Manage and Pay Securely:
            </span>
            <br />
            Track project progress and make secure payments through AquaNexus.
            Your satisfaction and safety are our priority.
          </li>
        </ol>
        <p className="text-gray-700">
          AquaNexus is committed to making water solutions accessible,
          transparent, and secure for all Kenyans.
        </p>
      </div>
    </section>
  );
}
