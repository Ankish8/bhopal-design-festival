"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import confetti from 'canvas-confetti'
import Image from 'next/image'
import type { LucideIcon } from 'lucide-react';
import { 
  Building, 
  Trophy, 
  BookOpen, 
  Users2Icon,
  WrenchIcon,
  UserCheckIcon,
  Clock,
  MapPin,
  PackageIcon,
  ScrollTextIcon,
  CheckCircleIcon,
  Check, 
  BoxIcon,
  Paintbrush,
  Box,
  ChevronRight, 
  ChevronLeft, 
  Palette, 
  Camera, 
  Lightbulb, 
  Newspaper, 
  GraduationCap, 
  Briefcase, 
  Info, 
  User, 
  Phone, 
  Mail 
} from "lucide-react"

// Types and Interfaces
type WorkshopDate = "November 21st, 2024" | "November 22nd, 2024" | "November 23rd, 2024";

type Workshop = {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
  details: string;
}

type Workshops = {
  [K in WorkshopDate]: Workshop[];
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationType: string;
  organizationName: string;
  competition: string;
  workshops: {
    [K in WorkshopDate]: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

// Animated Background Component
function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-pink-600 to-amber-500 animate-gradient"></div>
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`bubble-${i + 1} absolute bg-white/10 rounded-full animate-rise`}
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${(i + 1) * 10}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Form Steps and Data
const formSteps = [
  { title: "Personal Information", description: "Tell us about yourself" },
  { title: "Organization Details", description: "Information about your organization" },
  { title: "Competition", description: "Choose your competition" },
  { title: "Workshops", description: "Select your workshops" },
  { title: "Review", description: "Review your registration details" },
]

const organizationTypes = [
  { value: "school", label: "School Student", icon: GraduationCap },
  { value: "college", label: "College Student", icon: Building },
  { value: "professional", label: "Working Professional", icon: Briefcase },
]
const competitions = [
  { 
    value: "vernacular-logo", 
    label: "Vernacular Logo Design", 
    icon: BoxIcon, 
    description: "Design a logo representing solutions to real-world challenges",
    details: `Overview
Let your imagination run wild and design a logo that represents solutions to real-world challenges. This contest encourages entries to unleash their creativity to develop a logo that captures the essence of making a difference and being innovative. The logo design should symbolize a given theme/concept and demonstrate their ability to communicate impactful messages through design.

Mode
Digital / Physical

Categories
School Student / College Student

Team Size
Individual

Rules
- Design should reflect the concepts of the given brief
- Each participant/team may submit only one entry
- Designs submitted must be original creations
- Plagiarism or copyright infringement will result in disqualification
- The design should be submitted along with the title and write-up
- Submissions must be sent to [Design Fest Email] by specified deadline

Requirements
- A4 Paper
- Basic Stationery
- Laptop/tablets for digital mode

Deliverables
- Ideation, process, and any refinements made
- Final design with an explanation of concept (50-100 words)
- A4 paper size for physical submission
- Original software file for digital submission (AI, SVG)

Note
The brief will be given on the spot`
  },
  { 
    value: "visionary-ventures", 
    label: "Visionary Ventures", 
    icon: Lightbulb, 
    description: "Ideate and build solutions for communities",
    details: `Overview
This competition will unleash your creativity to the fullest, where you will Ideate and build a solution for communities. You will learn and apply a design thinking process to the given problem statement to create a better world.

Mode
Digital / Physical

Categories
School Student / College Student

Team Size
Group of 4-5

Rules
- The logo should reflect the concepts of the given brief
- Each participant should submit only one entry
- The logo design submitted must be an original creation
- Plagiarism or copyright infringement will result in disqualification
- The logo design should be submitted along with the title and write-up

Requirements
- Paper
- Basic Stationery
- Laptop/tablets for digital mode

Deliverables
- Paper prototype
- Brief description (50-100 words) explaining the design concept
- Final design process - Physical or digital (Max A3 Size)

Note
The brief will be given on the spot`
  },
  { 
    value: "visual-storytelling", 
    label: "Visual Storytelling", 
    icon: Camera, 
    description: "Create compelling photo stories on given themes",
    details: `Overview
Unleash the power of storytelling through the lens with our Visual Storytelling Competition. Participants are challenged to create a compelling photo story based on a given theme, capturing emotions, narratives, and perspectives through a sequence of images. This competition encourages creativity, visual coherence, and the ability to convey a story without words.

Mode
Digital / Physical

Categories
School Student / College Student

Team Size
Group of 2 to 4

Rules
- Story should reflect the given theme/s
- Each participant/team may submit only one entry
- Stories submitted must be original creations
- Plagiarism or copyright infringement will result in disqualification
- Story should be submitted along with supporting documents

Requirements
- DSLR / Digital Camera / Mobile Phone with good Camera
- Basic Stationery

Deliverables
- Themed Photo Series: 5-7 images that narrate a cohesive story
- Title and Brief Description: 50-100 word caption explaining the story
- Photo Layout Presentation: Digital submission with suggested layout
- Behind-the-Scenes Insight (Optional): Short write-up on the process

Note
The brief/Theme will be given on the spot`
  },
  { 
    value: "fashion-show", 
    label: "Ethereal Flora Fashion Show", 
    icon: Palette, 
    description: "A Journey into Nature's Essence",
    details: `Overview
We are delighted to invite you to participate in our upcoming fashion show-themed Ethereal Flora: A Journey into Nature's Essence. This event celebrates the harmony between nature's beauty and sustainable fashion, inviting designers to reimagine ensembles inspired by the resilience and simplicity of nature. We encourage the use of sustainable materials and embrace eco-conscious fashion that respects and reconnects with our environment.

Mode
Offline

Categories
School Student / College Student

Team Size
Group of 3 to 6

Rules
- Ensemble should reflect the given theme
- Each participant/team may submit only one entry
- Entries submitted must be original creations
- Plagiarism or copyright infringement will result in disqualification

Requirements
- 3-5 ensembles (should include garments, accessories, styling and makeup)
- Short description (100-150 words) and title (max. 5 words)
- Music track for the show

Deliverables
- Nature-Inspired Ensemble Collection: 3-5 ensembles embodying Ethereal Flora theme
- Incorporate sustainable materials for garments, accessories, styling and makeup
- Design Concept Statement: Description and title explaining inspiration`
  }
]

const workshops: Workshops = {
  "November 21st, 2024": [
    { 
      value: "printmaking", 
      label: "Printmaking Workshop", 
      icon: Palette, 
      description: "Explore LinoCut printmaking techniques",
      details: `Mode: Offline...`
    },
    { 
      value: "fashion-photography", 
      label: "Fashion Photography", 
      icon: Camera, 
      description: "Learn to capture captivating fashion imagery",
      details: `Mode: Offline...`
    },
  ],
  "November 22nd, 2024": [
    { 
      value: "biomimicry", 
      label: "Ways of Nature: Understanding Biomimicry", 
      icon: Newspaper, 
      description: "Explore paper techniques inspired by nature.",
      details: `Mode: Offline...`
    },
    { 
      value: "space-design", 
      label: "Space Design 3D Architectural Model", 
      icon: Building, 
      description: "Create impressive 3D architectural models",
      details: `Mode: Offline...`
    },
  ],
  "November 23rd, 2024": [
    {
      value: "life-between-frames",
      label: "Life Between Frames",
      icon: Camera,
      description: "Learn the art of stop motion animation",
      details: `Mode: Offline

Overview:
This stop motion workshop, "Life Between Frames" offers an engaging introduction to the art of stop motion animation. Participants will learn to bring inanimate objects to life, explore storytelling techniques, and discover the magic of creating movement frame by frame.`
    }
  ]
}

const organizationMappings = {
  "Jagran Lakecity University": [
    "JLU",
    "Jagran lake city University",
    "Jagran lakecity university",
    "Jagran Lakecity university",
    "JLU Bhopal",
    "Jagaran Lakecity University",
    "Jagran Lake City University",
    "Jagran lakecity University Bhopal",
    "JSJC",
    "Jlu",
    "Jagran school of design",
    "JLU Bholap",
    "Jaagran lakecity university",
    "Jagran LakeCity University"
  ],
  "Delhi Public School, Neelbad": [
    "DPS Neelbad",
    "Delhi Public School Neelbad",
    "Delhi public school neelbad",
    "DPS neelbad bhopal",
    "Delhi Public School, Neelbad, Bhopal",
    "DPS",
    "Delhi Public School"
  ],
  "Delhi Public School, Kolar": [
    "DPS Kolar",
    "Delhi Public School Kolar",
    "Delhi public school kolar",
    "DPS kolar bhopal",
    "Delhi Public School, Kolar, Bhopal",
    "DPS",
    "Delhi Public School"
  ],
  "Delhi Public School, Rau": [
    "DPS Rau",
    "Delhi Public School Rau",
    "Delhi public school rau",
    "DPS RAU Indore",
    "Delhi Public School, Rau Indore",
    "DPS",
    "Delhi Public School"
  ],
  "Delhi Public School, Nipania": [
    "DPS Nipania",
    "Delhi Public School Nipania",
    "Delhi public school nipania",
    "DPS nipania indore",
    "Delhi Public School, Nipania, Indore",
    "DPS",
    "Delhi Public School"
  ],
  "Sage University": [
    "SAGE",
    "Sage university",
    "SAGE Uni",
    "Sage Uni",
    "SAGE University"
  ],
  "Makhanlal Chaturvedi University": [
    "Makhanlal chaturvedi university",
    "MCU",
    "Makhanlal Chaturvedi University"
  ],
  "Sagar Public School": ["Sagar Public School"],
  "Peoples Public School": ["Peoples public school"],
  "The Bhopal School of Social Sciences": ["The Bhopal school of social science"],
  "School of Planning and Architecture": ["School of planning and architecture"],
  "UIT RGPV": [
    "UIT RGPV Bhopal",
    "UIT RGPV BHOPAL"
  ],
  "Career College": ["Career College"],
  "A. P. Moller Maersk": ["A. P. Moller Maersk"],
  "McCann Worldgroup": ["McCann Worldgroup"],
  "PhonePe": ["PhonePe"],
  "eClerx": ["eClerx"],
  "Aureate Labs": ["Aureate Labs"],
  "CodeCartel LLP": ["Codecartel llp"],
  "Golden Ratio Designs": ["Golden Ratio Designs"],
  "Pristine Ideas": ["Pristine ideas"],
  "Impact4Nutrition": ["Impact4Nutrition"],
  "Draftss": ["Draftss", "Drafts"],
  "DzyenCrew": ["DzyenCrew"],
  "Mystique7": ["Mystique7"],
  "CESIT Ltd": ["CESIT Ltd"],
  "Freelancer": [
    "Freelancer",
    "Freelance designer",
    "Freelancer, Student at BU"
  ]
};

const workshopDates = Object.keys(workshops) as Array<keyof typeof workshops>;

export function EnhancedRegistrationFormComponent() {
  const [step, setStep] = useState(0)
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organizationType: "",
    organizationName: "",
    competition: "",
    workshops: {
      "November 21st, 2024": "",
      "November 22nd, 2024": "",
      "November 23rd, 2024": "",
    },
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const suggestionRef = useRef(null);

  const handleOrganizationInput = (input) => {
    updateFormData("organizationName", input);
    
    if (!input) {
      setShowSuggestions(false);
      return;
    }
  
    const filtered = [];
    const isDPSSearch = input.toLowerCase() === "dps" || 
                       input.toLowerCase().includes("delhi public");
  
    Object.entries(organizationMappings).forEach(([official, variants]) => {
      // Special handling for DPS schools
      if (formData.organizationType === "school" && isDPSSearch) {
        if (official.toLowerCase().includes("delhi public school")) {
          filtered.push({
            official: official,
            matches: variants.filter(name => 
              // Exclude the generic "DPS" variant but include specific ones
              !(name === "DPS" || name === "Delhi Public School") &&
              name.toLowerCase().includes(input.toLowerCase())
            )
          });
        }
      }
      // Regular search for other cases
      else if (
        official.toLowerCase().includes(input.toLowerCase()) || 
        variants.some(variant => variant.toLowerCase().includes(input.toLowerCase()))
      ) {
        // Filter based on organization type
        const shouldInclude = 
          (formData.organizationType === "school" && official.toLowerCase().includes("school")) ||
          (formData.organizationType === "college" && 
            (official.toLowerCase().includes("college") || 
             official.toLowerCase().includes("university"))) ||
          (formData.organizationType === "professional" && 
            !official.toLowerCase().includes("school") && 
            !official.toLowerCase().includes("university"));
  
        if (shouldInclude) {
          filtered.push({
            official: official,
            matches: variants.filter(name => 
              name.toLowerCase().includes(input.toLowerCase())
            )
          });
        }
      }
    });
  
    // Sort DPS schools alphabetically if it's a DPS search
    if (isDPSSearch) {
      filtered.sort((a, b) => a.official.localeCompare(b.official));
    }
  
    setFilteredSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  const updateFormData = (field: keyof FormData | string, value: string | Record<string, string>) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStep = () => {
    const newErrors: FormErrors = {}
    switch (step) {
      case 0:
        if (!formData.firstName) newErrors["firstName"] = "First name is required"
        if (!formData.lastName) newErrors["lastName"] = "Last name is required"
        if (!formData.email) newErrors["email"] = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors["email"] = "Invalid email format"
        if (!formData.phone) {
          newErrors["phone"] = "Phone number is required";
        } else {
          const phoneNum = formData.phone.replace(/\D/g, '');
          if (phoneNum.length !== 10) {
            newErrors["phone"] = "Phone number must be 10 digits";
          } else if (!/^[0-9]\d{9}$/.test(phoneNum)) {
            newErrors["phone"] = "Please enter a valid Indian mobile number";
          }
        }
        break;
      case 1:
        if (!formData.organizationType) newErrors["organizationType"] = "Organization type is required"
        if (!formData.organizationName) newErrors["organizationName"] = "Organization name is required"
        break
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) {
      if (step === 1 && formData.organizationType === "professional") {
        setStep(3)
      } else {
        setStep((prev) => Math.min(prev + 1, formSteps.length - 1))
      }
    }
  }

  const prevStep = () => {
    if (step === 3 && formData.organizationType === "professional") {
      setStep(1)
    } else {
      setStep((prev) => Math.max(prev - 1, 0))
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="firstName" className="text-[#212120]">First Name</Label>
    <div className="relative">
      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#460E2F]" />
      <Input
        id="firstName"
        placeholder="Enter first name"
        value={formData.firstName}
        onChange={(e) => {
          const value = e.target.value.replace(/^[a-z]/, c => c.toUpperCase());
          updateFormData("firstName", value);
        }}
        className="pl-10 border-[#D2DDDE] focus:border-[#460E2F] focus:ring-[#460E2F]"
        autoCapitalize="words"
      />
    </div>
    {errors["firstName"] && (
      <p className="text-[#9A1B22] text-sm">{errors["firstName"]}</p>
    )}
  </div>
  <div className="space-y-2">
    <Label htmlFor="lastName" className="text-[#212120]">Last Name</Label>
    <div className="relative">
      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#460E2F]" />
      <Input
        id="lastName"
        placeholder="Enter last name"
        value={formData.lastName}
        onChange={(e) => {
          const value = e.target.value.replace(/^[a-z]/, c => c.toUpperCase());
          updateFormData("lastName", value);
        }}
        className="pl-10 border-[#D2DDDE] focus:border-[#460E2F] focus:ring-[#460E2F]"
        autoCapitalize="words"
      />
    </div>
    {errors["lastName"] && (
      <p className="text-[#9A1B22] text-sm">{errors["lastName"]}</p>
    )}
  </div>
</div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#212120]">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#460E2F]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="pl-10 border-[#D2DDDE] focus:border-[#460E2F] focus:ring-[#460E2F]"
                />
              </div>
              {errors["email"] && (
                <p className="text-[#9A1B22] text-sm">{errors["email"]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#212120]">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#460E2F]" />
                <Input
  id="phone"
  placeholder="Enter your mobile number"
  value={formData.phone}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Remove leading 91 if present (in case user enters +91)
    if (value.startsWith('91') && value.length > 2) {
      value = value.slice(2);
    }
    
    // Only keep last 10 digits if longer
    if (value.length > 10) {
      value = value.slice(-10);
    }
    
    // Format: XXXXX XXXXX for Indian numbers
    if (value.length > 5) {
      value = `${value.slice(0, 5)} ${value.slice(5)}`;
    }
    
    updateFormData("phone", value);
  }}
  className="pl-10 border-[#D2DDDE] focus:border-[#460E2F] focus:ring-[#460E2F]"
  maxLength={11} // 5 digits + space + 5 digits = 11 characters
/>
              </div>
              {errors["phone"] && (
                <p className="text-[#9A1B22] text-sm">{errors["phone"]}</p>
              )}
            </div>
          </motion.div>
        )
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
            <Label className="text-[#212120]">Participating As</Label>              <RadioGroup
                value={formData.organizationType}
                onValueChange={(value) => updateFormData("organizationType", value)}
                className="flex flex-col space-y-2"
              >
                {organizationTypes.map((org) => (
                  <Label
                    key={org.value}
                    htmlFor={org.value}
                    className="flex items-center space-x-2 p-2 rounded-lg border border-[#D2DDDE] cursor-pointer transition-all duration-300 hover:bg-[#D2DDDE]/20 hover:border-[#460E2F]"
                  >
                    <RadioGroupItem value={org.value} id={org.value} className="border-[#460E2F]" />
                    <org.icon className="w-5 h-5 text-[#460E2F]" />
                    <span className="text-[#212120]">{org.label}</span>
                  </Label>
                ))}
              </RadioGroup>
              {errors["organizationType"] && (
                <p className="text-[#9A1B22] text-sm">{errors["organizationType"]}</p>
              )}
            </div>
            {formData.organizationType && (
  <div className="space-y-2">
    <Label htmlFor="organizationName" className="text-[#212120]">
      {formData.organizationType === "school" ? "School Name" :
       formData.organizationType === "college" ? "College Name" :
       "Company Name"}
    </Label>
    <div className="relative">
      <Input
        id="organizationName"
        placeholder={`Enter your ${
          formData.organizationType === "school" ? "school" :
          formData.organizationType === "college" ? "college" :
          "company"
        } name`}
        value={formData.organizationName}
        onChange={(e) => handleOrganizationInput(e.target.value)}
        onFocus={() => {
          if (formData.organizationName) {
            handleOrganizationInput(formData.organizationName);
          }
        }}
        className="border-[#D2DDDE] focus:border-[#460E2F] focus:ring-[#460E2F]"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-[#D2DDDE]">
          <ul className="max-h-60 overflow-auto py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-[#D2DDDE]/20 cursor-pointer"
                onClick={() => {
                  updateFormData("organizationName", suggestion.official);
                  setShowSuggestions(false);
                }}
              >
                <div className="font-medium text-[#460E2F]">{suggestion.official}</div>
                {suggestion.matches.length > 1 && (
                  <div className="text-sm text-[#212120]/70 mt-1">
                    Also known as: {suggestion.matches
                      .filter(m => m !== suggestion.official)
                      .slice(0, 2)
                      .join(", ")}
                    {suggestion.matches.length > 3 && " ..."}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    {errors["organizationName"] && (
      <p className="text-[#9A1B22] text-sm">{errors["organizationName"]}</p>
    )}
  </div>
)}
          </motion.div>
        )
        case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              <Label className="text-[#212120] text-lg font-semibold">Select Your Competition</Label>
              <RadioGroup
                value={formData.competition}
                onValueChange={(value) => updateFormData("competition", value)}
                className="flex flex-col space-y-2"
              >
                {competitions.map((competition) => (
                  <Label
                    key={competition.value}
                    htmlFor={competition.value}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-[#D2DDDE] cursor-pointer transition-all duration-300 hover:bg-[#D2DDDE]/20 hover:border-[#460E2F]"
                  >
                    <RadioGroupItem value={competition.value} id={competition.value} className="border-[#460E2F]" />
                    <div className="space-y-1 flex-1">
                      <div className="font-medium flex items-center justify-between">
                        <div className="flex items-center">
                          <competition.icon className="w-5 h-5 mr-2 text-[#460E2F] flex-shrink-0" />
                          <div>
                            <div className="text-[#212120]">{competition.label}</div>
                            <p className="text-sm text-[#212120]/70">{competition.description}</p>
                          </div>
                        </div>
                        <Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" size="sm" className="border-[#460E2F] text-[#460E2F] hover:bg-[#D2DDDE]/20">
      <Info className="w-4 h-4 mr-2" />
      Details
    </Button>
  </DialogTrigger>
  <DialogContent 
  className="sm:max-w-[550px] bg-white shadow-xl border-0" 
  onInteractOutside={(e) => e.preventDefault()}
  onEscapeKeyDown={(e) => e.preventDefault()}
>
    <DialogHeader className="border-b border-[#D2DDDE] pb-4">
      <div className="flex items-center space-x-3">
        <competition.icon className="w-8 h-8 text-[#460E2F]" />
        <div>
          <DialogTitle className="text-[#460E2F] text-2xl font-bold tracking-normal">
            {competition.label}
          </DialogTitle>
          <p className="text-[#212120]/70 mt-1">{competition.description}</p>
        </div>
      </div>
    </DialogHeader>
    <ScrollArea className="mt-4 max-h-[65vh] pr-6">
      <div className="space-y-6">
      {competition.details.split('\n\n').map((section, index) => {
  const [title, ...content] = section.split('\n');
  return (
    <div key={index} className="text-[#212120] mb-6">
      <div className="flex items-center space-x-2 mb-3">
        {title.toLowerCase().includes('overview') && <BookOpen className="w-5 h-5 text-[#460E2F]" />}
        {title.toLowerCase().includes('mode') && <Building className="w-5 h-5 text-[#460E2F]" />}
        {title.toLowerCase().includes('categories') && <Users2Icon className="w-5 h-5 text-[#460E2F]" />}
        {title.toLowerCase().includes('team size') && <Users2Icon className="w-5 h-5 text-[#460E2F]" />}
        {title.toLowerCase().includes('rules') && <ScrollTextIcon className="w-5 h-5 text-[#460E2F]" />}
        {title.toLowerCase().includes('requirements') && <WrenchIcon className="w-5 h-5 text-[#460E2F]" />}
        {title.toLowerCase().includes('deliverables') && <PackageIcon className="w-5 h-5 text-[#460E2F]" />}
        {title.toLowerCase().includes('note') && <Info className="w-5 h-5 text-[#460E2F]" />}
        <h3 className="font-semibold text-lg text-[#460E2F]">{title.trim()}</h3>
      </div>
      <div className="space-y-2 ml-7">
        {content.map((line, i) => (
          <div key={i} className="text-base leading-relaxed">
            {line.trim().startsWith('-') ? (
              <div className="flex items-start space-x-2">
                <span className="text-[#460E2F] mt-1">•</span>
                <span className="text-[#212120]/90">
                  {line.substring(1).trim()}
                </span>
              </div>
            ) : (
              <p className="text-[#212120]/90">{line.trim()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
})}
      </div>
    </ScrollArea>
  </DialogContent>
</Dialog>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Label className="text-[#212120] text-lg font-semibold">Select Your Workshops</Label>
            {Object.entries(workshops).map(([date, dayWorkshops]) => (
              <div key={date} className="space-y-4">
                <h3 className="text-[#460E2F] font-semibold">{date}</h3>
                <RadioGroup
                  value={formData.workshops[date as keyof typeof formData.workshops]}
                  onValueChange={(value) => updateFormData("workshops", { ...formData.workshops, [date]: value })}
                  className="flex flex-col space-y-2"
                >
                  {dayWorkshops.map((workshop) => (
                    <Label
                      key={workshop.value}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-[#D2DDDE] cursor-pointer transition-all duration-300 hover:bg-[#D2DDDE]/20 hover:border-[#460E2F]"
                    >
                      <RadioGroupItem value={workshop.value} id={`${date}-${workshop.value}`} className="border-[#460E2F]" />
                      <div className="space-y-1 flex-1">
                        <div className="font-medium flex items-center justify-between">
                          <div className="flex items-center">
                            <workshop.icon className="w-5 h-5 mr-2 text-[#460E2F] flex-shrink-0" />
                            <div>
                              <div className="text-[#212120]">{workshop.label}</div>
                              <p className="text-sm text-[#212120]/70">{workshop.description}</p>
                            </div>
                          </div>
                          

                          

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" size="sm" className="border-[#460E2F] text-[#460E2F] hover:bg-[#D2DDDE]/20">
      <Info className="w-4 h-4 mr-2" />
      Details
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[550px] bg-white shadow-xl border-0">
  <DialogHeader>
    <div className="flex items-center space-x-3 mb-8">
      <workshop.icon className="w-10 h-10 text-[#460E2F]" />
      <div>
        <DialogTitle className="text-[#460E2F] text-xl font-bold">
          {workshop.label}
        </DialogTitle>
        <p className="text-[#212120]/70 text-base mt-1">{workshop.description}</p>
      </div>
    </div>
  </DialogHeader>
  <ScrollArea className="mt-2 max-h-[65vh]">
    <div className="space-y-6 pr-6">
      {workshop.details.split('\n\n').map((section, index) => {
        const [title, ...content] = section.split('\n');
        return (
          <div key={index} className="text-[#212120]">
            <p className="font-semibold text-lg text-[#460E2F] mb-3">{title.trim()}</p>
            <p className="text-[#212120] text-base leading-relaxed">{content.join('\n').trim()}</p>
          </div>
        );
      })}
    </div>
  </ScrollArea>
</DialogContent>
</Dialog>


                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </motion.div>
        )
        case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-[#D2DDDE]/20 p-6 rounded-lg space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-[#460E2F]" />
                <div>
                  <p className="font-medium text-[#212120]">Name</p>
                  <p className="text-sm text-[#212120]/70">{`${formData.firstName} ${formData.lastName}`}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-[#460E2F]" />
                <div>
                  <p className="font-medium text-[#212120]">Organization</p>
                  <p className="text-sm text-[#212120]/70">{formData.organizationName} ({formData.organizationType})</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-[#460E2F]" />
                <div>
                  <p className="font-medium text-[#212120]">Competition</p>
                  <p className="text-sm text-[#212120]/70">
                    {competitions.find(c => c.value === formData.competition)?.label || "None selected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#460E2F]" />
                <div>
                  <p className="font-medium text-[#212120]">Workshops</p>
                  {Object.entries(formData.workshops).map(([date, workshopValue]) => (
                    <p key={date} className="text-sm text-[#212120]/70">
                      {date}: {workshops[date as WorkshopDate].find(w => w.value === workshopValue)?.label || "None selected"}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-[#212120]/70">Please review your information before submitting.</p>
          </motion.div>
        )
      default:
        return null
    }
  }




  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true)
      try {
        const makeData = {
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
          competitionName: competitions.find(c => c.value === formData.competition)?.label || "",
          workshopsSelected: workshopDates.map((date) => ({
            date,
            workshop: workshops[date].find(w => w.value === formData.workshops[date])?.label || "None selected"
          })),
          submissionDate: new Date().toISOString(),
        }

        const response = await fetch('https://hook.eu2.make.com/bone3wxkg21torr3n096m4x6gw36lys1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makeData)
        });

        if (!response.ok) throw new Error('Failed to submit form');
        
        setIsSubmitted(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form. Please try again.');
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (isSubmitted) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center text-[#460E2F]">Thank You!</CardTitle>
                <CardDescription className="text-center text-[#212120]">
                  Your registration for the Bhopal Design Festival is complete.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                <p className="text-lg text-[#460E2F]">We're excited to have you join us, {formData.firstName}!</p>                  <p className="text-[#212120]">Keep an eye on your email for further details and updates about the festival.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AnimatedBackground>
    )
  }

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex flex-col items-center pt-12 px-4">
      <div className="w-full max-w-2xl mb-4">
  <Image
    src="/bdf-logo.svg"
    alt="Bhopal Design Festival Logo"
    width={150}
    height={150}
    className="mx-auto"
    style={{ filter: 'hue-rotate(60deg) brightness(1.2)' }}
  />
</div>

  <div className="w-full max-w-2xl">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-4"
    >
      <p className="text-xl text-white">21<sup>st</sup> - 23<sup>rd</sup> November 2024</p>
    </motion.div>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold text-[#460E2F]">{formSteps[step].title}</CardTitle>
                <p className="text-sm text-[#212120]/70">Step {step + 1} of {formSteps.length}</p>
              </div>
              <CardDescription className="text-[#212120]">{formSteps[step].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="relative h-1 bg-[#D2DDDE] rounded-full">
                  <motion.div
                    className="absolute top-0 left-0 h-1 bg-[#460E2F] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((step + 1) / formSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <AnimatePresence mode="wait" initial={false}>
                {renderStep()}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between">
              {step > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={prevStep} 
                    variant="outline" 
                    className="border-[#460E2F] text-[#460E2F] hover:bg-[#D2DDDE]/20"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                </motion.div>
              )}
              
              {step < formSteps.length - 1 ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-auto">
                  <Button 
                    onClick={nextStep} 
                    className="bg-[#460E2F] hover:bg-[#460E2F]/90 text-white"
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-auto">
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-[#F68B29] hover:bg-[#F68B29]/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"} 
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </AnimatedBackground>
  )
}
