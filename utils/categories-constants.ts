import {
    Users,
    GraduationCap,
    Heart,
    DollarSign,
    Home,
    Shield,
    Wheat,
    Building2,
    MapPin,
    Plane,
    Scale,
    Banknote,
    Car,
    Calendar,
    CreditCard,
    TreePine,
    Palette,
} from "lucide-react";

export const CATEGORIES = [
    {
        id: 479,
        categoryName: "Family",
        categoryDescription: "Services related to the family",
        image: "Family1.png",
        file: null,
    },
    {
        id: 480,
        categoryName: "Education & Learning",
        categoryDescription:
            " Learning is a lifelong process of transforming information and experience into knowledge, skills, and behaviours.",
        image: "Education1.png",
        file: null,
    },
    {
        id: 483,
        categoryName: "Health & Wellness",
        categoryDescription:
            "Health refers to physical, mental, and social well-being; wellness aims to enhance well-being.",
        image: "Health and well being.png",
        file: null,
    },
    {
        id: 484,
        categoryName: "Money & Property",
        categoryDescription:
            "Money and property law are mutually constitutive.",
        image: "Money and Proprety.png",
        file: null,
    },
    {
        id: 485,
        categoryName: "Construction & Housing",
        categoryDescription:
            "Bhutan pursues a unique and sustainable approach to development based on the philosophy of Gross National Happiness (GNH).",
        image: "Constructions.png",
        file: null,
    },
    {
        id: 486,
        categoryName: "Security & Defense",
        categoryDescription:
            "Security refers to all the measures that are taken to protect a place, or to ensure that only people with permission enter it or leave it.",
        image: "security1 (2).png",
        file: null,
    },
    {
        id: 487,
        categoryName: "Agriculture & Livestock",
        categoryDescription:
            "The impact of agricultural practices on the environment. ",
        image: "Agrivulture (2).png",
        file: null,
    },
    {
        id: 488,
        categoryName: "Business & Tax Services",
        categoryDescription:
            "The taxes that businesses must pay as a normal part of business operations.",
        image: "Land1 (2).png",
        file: null,
    },
    {
        id: 489,
        categoryName: "Thromde Utlitity Service",
        categoryDescription:
            " Thromde Want to build a house, get occupancy certificate, water connection, etc. Check Thromde services.",
        image: "Thromde all (2).png",
        file: null,
    },
    {
        id: 490,
        categoryName: "Tourism, Passport & Visa",
        categoryDescription:
            "The Bhutan visa application form is available online on the eVisa website",
        image: "passport1.png",
        file: null,
    },
    {
        id: 491,
        categoryName: "Justice, Law & Grievances",
        categoryDescription:
            "The Judiciary of Bhutan established the Grievance Cell to understand and address the aspirations and needs of justice service consumers",
        image: "lAW AND jUSTICS (3).png",
        file: null,
    },
    {
        id: 492,
        categoryName: "Pension services",
        categoryDescription:
            "You can avail Pension and Provident related services from here. ",
        image: "pENSION BHUTAN (2).png",
        file: null,
    },
    {
        id: 493,
        categoryName: "Transport & Infrastructure",
        categoryDescription:
            "To be a dynamic organization for building quality and sustainable infrastructure, efficient transportation services, and built environment",
        image: "tRANSPORT NA D iNF (2).png",
        file: null,
    },
    {
        id: 494,
        categoryName: "Life Events",
        categoryDescription: "Frequently used service",
        image: "Health and well being.png",
        file: null,
    },
    {
        id: 548,
        categoryName: "Online Payment",
        categoryDescription: "Pay online for any services available in G2C",
        image: "payOnline.png",
        file: null,
    },
    {
        id: 622,
        categoryName: "Environment & Forest",
        categoryDescription:
            "Environment and forest services focus on conserving ecosystems, reforestation, and sustainable resource management. They also involve environmental monitoring and public education on conservation issues.",
        image: "download.jpeg",
        file: null,
    },
    {
        id: 627,
        categoryName: "Cultural Affairs ",
        categoryDescription:
            "If the items are culturally significant but not classified as antiques, they may still need clearance from cultural authorities.",
        image: "Untitled.png",
        file: null,
    },
];

export const categoryIconMap = new Map<
    number,
    {
        icon: React.ElementType;
        color: string;
        bgColor: string;
    }
>([
    [479, { icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" }],
    [
        480,
        {
            icon: GraduationCap,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
    ],
    [483, { icon: Heart, color: "text-red-600", bgColor: "bg-red-50" }],
    [
        484,
        { icon: DollarSign, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    ],
    [485, { icon: Home, color: "text-orange-600", bgColor: "bg-orange-50" }],
    [486, { icon: Shield, color: "text-gray-600", bgColor: "bg-gray-50" }],
    [487, { icon: Wheat, color: "text-emerald-600", bgColor: "bg-emerald-50" }],
    [
        488,
        { icon: Building2, color: "text-purple-600", bgColor: "bg-purple-50" },
    ],
    [489, { icon: MapPin, color: "text-teal-600", bgColor: "bg-teal-50" }],
    [490, { icon: Plane, color: "text-sky-600", bgColor: "bg-sky-50" }],
    [491, { icon: Scale, color: "text-indigo-600", bgColor: "bg-indigo-50" }],
    [492, { icon: Banknote, color: "text-rose-600", bgColor: "bg-rose-50" }],
    [493, { icon: Car, color: "text-cyan-600", bgColor: "bg-cyan-50" }],
    [494, { icon: Calendar, color: "text-pink-600", bgColor: "bg-pink-50" }],
    [
        548,
        { icon: CreditCard, color: "text-violet-600", bgColor: "bg-violet-50" },
    ],
    [622, { icon: TreePine, color: "text-lime-600", bgColor: "bg-lime-50" }],
    [627, { icon: Palette, color: "text-amber-600", bgColor: "bg-amber-50" }],
]);
