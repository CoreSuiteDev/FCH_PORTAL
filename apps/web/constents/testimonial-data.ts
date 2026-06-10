export interface Testimonial {
  id: string
  text: string
  name: string
  role: string
  image: string // New field for the image source
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    text: "The Church in the United States must have a space where religious educators and other pastoral leaders come together on a regular basis to reflect about how catechesis takes place in light of the Hispanic Catholic Experience.",
    name: "HOSFFMAN OSPINO, PHD",
    role: "Boston college",
    image: "/assets/user-1.png", // Placeholder for Hosffman Ospino, PHD
  },
  {
    id: "2",
    text: "Hispanic catechists need an organization to be able to share. What can we share? Well, our goals, achievements, successes, challenges and how we learn along the way.",
    name: "IUPITA VITAL",
    role: "Director to the Hispanic Apostolate, San Jose Diócesis, CA",
    image: "/assets/user-2.png", // Placeholder for Iupita Vital
  },
  {
    id: "3",
    text: "FCH is a place to go and find a network of people with whom we can share what I do in catechism sessions.",
    name: "MARIA GARCIA",
    role: "Catechist, Diocese of Austin",
    image: "/assets/user-3.png", // Reuse profile image or add a new unique one
  },
  {
    id: "4",
    text: "An incredible resource that has transformed how we approach pastoral leadership in our parish community.",
    name: "REV. ANTHONY SMITH",
    role: "Pastor, St. Jude Parish",
    image: "/assets/user-1.png", // Reuse profile image or add a new unique one
  },
]
