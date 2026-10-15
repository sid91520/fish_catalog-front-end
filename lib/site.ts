export const site = {
  name: "Mumbaicha Masewala",
  tagline: "ताजेपणाचा शाही अनुभव",
  phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  email: "hello@mumbaichamasewala.example",
  address: "Fish Market Road, Your City",
  hours: "Daily · 6:00 AM – 9:00 PM",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const digits = () => site.phone.replace(/\D/g, "");

export const telUrl = () => (digits() ? `tel:+${digits()}` : "tel:");
export const whatsappUrl = (text: string) =>
  `https://wa.me/${digits()}?text=${encodeURIComponent(text)}`;
