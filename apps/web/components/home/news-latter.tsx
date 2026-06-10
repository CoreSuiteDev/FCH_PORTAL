"use client"

import { useForm } from "react-hook-form"

export function NewsletterSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => console.log(data)

  return (
    <section className="relative px-6 py-24">
      {/* Background Image Add kora hoyeche */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/news-latter.jpg')" }}
      />

      {/* Form container-e padding ebong size barano hoyeche */}
      <div className="relative z-10 mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-2xl md:p-16">
        <h2 className="mb-10 text-center text-3xl font-extrabold text-[#c42028]">
          SIGN UP FOR OUR NEWSLETTER
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                {...register("firstName", { required: true })}
                type="text"
                placeholder="First Name"
                className="w-full rounded-lg border border-gray-300 p-3 text-base focus:ring-2 focus:ring-[#c42028] focus:outline-none"
              />
              {errors.firstName && (
                <span className="text-xs text-red-500">
                  First name is required
                </span>
              )}
            </div>

            <div className="md:pt-7">
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last Name"
                className="w-full rounded-lg border border-gray-300 p-3 text-base focus:ring-2 focus:ring-[#c42028] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              type="email"
              placeholder="your@mail.com"
              className="w-full rounded-lg border border-gray-300 p-3 text-base focus:ring-2 focus:ring-[#c42028] focus:outline-none"
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                Valid email is required
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#c42028] py-4 text-lg font-bold text-white transition hover:bg-red-800"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  )
}
