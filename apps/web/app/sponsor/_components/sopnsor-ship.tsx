import React from "react"
import { Button } from "@workspace/ui/components/button"
import Container from "@/components/shared/container"

const tiers = [
  {
    id: "diamond",
    title: "Diamond Sponsorship",
    price: "$3,000",
    period: "/1 Year",
    isFeatured: true,
    btnColor: "bg-red-700 hover:bg-red-800",
    features: [
      "Priority listing on Partner Membership List",
      "Logo with direct website link",
      "Sponsor 3 webinars with product presentation",
      "$500 scholarship for young adult education",
      "Free exhibit space at Regional Conferences",
      "Logo featured on home page with link",
    ],
  },
  {
    id: "platinum",
    title: "Platinum Sponsorship",
    price: "$2,500",
    period: "/1 Year",
    btnColor: "bg-black hover:bg-gray-800",
    features: [
      "Listing on Partner Membership List",
      "Logo with direct website link",
      "Sponsor 2 webinars with product presentation",
      "$500 scholarship for young adult education",
      "Free exhibit space at Regional Conferences",
    ],
  },
  {
    id: "gold",
    title: "Gold",
    price: "$2,000",
    period: "/1 Year",
    features: [
      "Logo listing with link",
      "Sponsor 2 webinars",
      "Half-off booth exhibit space",
    ],
  },
  {
    id: "silver",
    title: "Silver",
    price: "$1,000",
    period: "/1 Year",
    features: ["Partner Membership Listing", "Sponsor 1 webinar per year"],
  },
  {
    id: "bronze",
    title: "Bronze",
    price: "$500",
    period: "/1 Year",
    features: ["Listing on our Partner Membership List"],
  },
]

export default function Sponsorship() {
  return (
    <div className="bg-white px-4 py-16">
      <Container className="mx-auto">
        <h2 className="mb-12 text-center font-serif text-4xl tracking-wide text-red-900 uppercase">
          Sponsorships and <br /> Sponsors Benefits
        </h2>

        {/* Top Row: 2 items */}
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          {tiers.slice(0, 2).map((tier) => (
            <div
              key={tier.id}
              className="relative flex flex-col rounded-lg border-2 border-red-900 p-8"
            >
              {tier.isFeatured && (
                <span className="absolute top-0 right-0 bg-red-800 px-3 py-1 text-xs text-white uppercase">
                  Most Impactful
                </span>
              )}
              <p className="mb-2 text-sm font-bold text-red-800 uppercase">
                Tier {tier.id === "diamond" ? "One" : "Two"}
              </p>
              <h3 className="mb-1 font-serif text-3xl font-bold">
                {tier.title}
              </h3>
              <p className="mb-6 text-2xl font-bold text-red-800">
                {tier.price}{" "}
                <span className="text-sm font-normal text-gray-600">
                  {tier.period}
                </span>
              </p>
              <ul className="mb-8 flex-grow space-y-4">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {feat}
                  </li>
                ))}
              </ul>
              <Button className={`w-full py-5 text-white ${tier.btnColor}`}>
                Become a Sponsor
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Row: 3 items */}
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.slice(2).map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col rounded-lg border-2 border-red-900 p-6"
            >
              <p className="mb-2 text-sm font-bold text-red-800 uppercase">
                Tier{" "}
                {tier.id === "gold"
                  ? "Three"
                  : tier.id === "silver"
                    ? "Four"
                    : "Five"}
              </p>
              <h3 className="mb-1 font-serif text-2xl font-bold">
                {tier.title}
              </h3>
              <p className="mb-6 text-xl font-bold text-red-800">
                {tier.price}{" "}
                <span className="text-sm font-normal text-gray-600">
                  {tier.period}
                </span>
              </p>
              <ul className="mb-8 flex-grow space-y-3">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {feat}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-red-900 py-5 text-red-900"
              >
                Become a Sponsor
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
