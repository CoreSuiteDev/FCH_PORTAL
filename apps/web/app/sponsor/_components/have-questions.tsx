import React from "react"

export default function HaveQuestions() {
  return (
    <section
      className="relative flex min-h-[400px] w-full items-center justify-center bg-cover bg-center px-6 py-20"
      style={{ backgroundImage: "url('/assets/Have.webp')" }} // Update your image path here
    >
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl px-4 text-center text-white">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl lg:text-5xl">
          HAVE QUESTIONS
          <br />
          ABOUT SPONSORSHIP?
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-gray-200 md:text-lg">
          Send us your questions, needs, or subjects you would like to discuss.
          We are here to help find the right partnership level for your
          organization.
        </p>

        <button className="rounded-md bg-white px-8 py-3 font-semibold text-black transition-colors duration-200 hover:bg-gray-100">
          Contact Us
        </button>
      </div>
    </section>
  )
}
