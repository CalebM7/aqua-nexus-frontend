import React from "react";

export default function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-aqua-blue">
          Frequently Asked Questions
        </h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-aqua-teal">
            How do I post a project?
          </h2>
          <p className="text-gray-700">
            Simply sign up as a user, log in, and click "Post a Project" on your
            dashboard. Fill in the project details and submit.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-aqua-teal">
            How are providers vetted?
          </h2>
          <p className="text-gray-700">
            All providers go through a verification process, including
            certification checks and reviews from previous clients.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-aqua-teal">
            Is payment secure?
          </h2>
          <p className="text-gray-700">
            Yes, all payments are handled securely through our platform,
            ensuring both client and provider protection.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-aqua-teal">
            Can I become a provider?
          </h2>
          <p className="text-gray-700">
            Yes! Sign up as a provider, complete your profile, and start bidding
            on projects.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-aqua-teal">
            Need more help?
          </h2>
          <p className="text-gray-700">
            Contact us at{" "}
            <a
              href="mailto:support@aquanexus.ke"
              className="text-aqua-blue underline"
            >
              support@aquanexus.ke
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
