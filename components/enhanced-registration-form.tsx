"use client"

import { useState } from "react"
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
type WorkshopDate = "November 21st, 2024" | "November 22nd, 2024";

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
  name: string;
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
  { value: "school", label: "School", icon: GraduationCap },
  { value: "college", label: "College", icon: Building },
  { value: "professional", label: "Professional", icon: Briefcase },
]
const competitions = [
  { 
    value: "visionary-ventures", 
    label: "Visionary Ventures", 
    icon: Lightbulb, 
    description: "Solve real-world problems with innovative solutions.",
    details: `Mode: Digital/Physical
Team size: Group of 4-5 members
Categories:
- 10+2 & College Students
- Working professionals

Deliverables:
- Paper prototype
- Brief description (50-100 words)
- Final design process (Physical or digital)

Main Problem Statements:
- How might we help students to get motivated and attend the classes?
- How might we help a beggar to live his life without begging?
- How might we help needy artists to sell their products?
- How might we help students for cooking and having nutritious and pocket friendly meals?
- Design a Guidebook of 5 Pages for a new person in the city of Bhopal?
- Design a web page for a new person in the city of Bhopal?

Rules:
- Design should reflect the concepts of given brief
- Each team may submit only one entry
- Design submitted must be original creations
- Plagiarism or copyright infringement will result in disqualification
- The design should be submitted along with the title and write up

Duration: November 21st-23rd morning`
  },
  { 
    value: "visual-storytelling", 
    label: "Visual Storytelling", 
    icon: Camera, 
    description: "Create a compelling photo story on a given theme.",
    details: `Mode: Offline
Team size: Maximum 4 members
Judges: Mr. Sunil Shukla & Dr. Rushit Dubal
Location: Theatre
Requirements:
- DSLR/Digital Camera/Mobile Phone with good camera
- Basic Stationery

Categories:
- 10+2 & College Students
- Working professionals

Deliverables:
- Themed Photo Series (5-7 images)
- Title and Brief Description (50-100 words)
- Photo Layout Presentation
- Optional: Behind-the-scenes write-up

Rules:
- Story should reflect the given theme/s
- Each team may submit only one entry
- Stories must be original creations
- Plagiarism or copyright infringement will result in disqualification
- Submit with all supporting documents

Evaluation Criteria:
- Interpretation of the theme
- Creativity and originality
- Aesthetic Sensibility
- Overall visual impact

Note: Brief will be given on the spot`
  },
  {
    value: "fashion-show",
    label: "Ethereal Flora Fashion Show",
    icon: Palette,
    description: "A Journey into Nature's Essence",
    details: `Mode: Offline
Team size: Individual or team
Location: Stage/Ramp
Judges: Ms. Saba Tiwari, Ms. Noopur Tiwari

Theme: Ethereal Flora: A Journey into Nature's Essence

Overview:
This event celebrates the harmony between nature's beauty and sustainable fashion, reimagining garments inspired by the resilience and simplicity of nature. Features light, flowing silhouettes, organic motifs, and artisanal techniques.

Requirements:
- Minimum 3-5 dresses per collection
- Use of sustainable materials (organic cotton, linen, recycled textiles)

Deliverables:
- Nature-Inspired Garment Collection (3-5 looks)
- Design Concept Statement (100-150 words per piece)

Rules:
- Dress must reflect the given theme
- Each participant/team may submit only one entry
- Entries must be original creations
- No plagiarism or copyright infringement

Evaluation Criteria:
- Interpretation of the theme
- Creativity and originality
- Aesthetic Sensibility
- Overall visual impact`
  }
]

const workshops: Workshops = {
  "November 21st, 2024": [
    { 
      value: "printmaking", 
      label: "Printmaking Workshop", 
      icon: Palette, 
      description: "Learn LinoCut techniques with Ravindra Shankar Roy.",
      details: `Mode: Offline
    Team size: Individual or group of 2
    Requirements:
    - Paper
    - Basic Stationery
    - Lino cut tools
    
    Eligibility: Anyone above the age of 18
    
    Overview:
    In this hands-on workshop, participants will learn to design, carve, and print their own unique artworks using linoleum blocks (Lino Sheets). Guided by expert techniques, this workshop will enable participants to transform their ideas into beautifully textured, tactile prints.
    
    Deliverables:
    - Introduction to LinoCut Techniques: Step-by-step demonstration of design transfer, carving, and inking
    - Personalized Artwork: Each participant will create and print their own design on paper
    - Take-Home Prints: 2-3 final prints in both single-color and multi-layered formats
    - Lino Carving Skills Guide: Handout or PDF on tips, tools, and techniques for future practice`
    },
    { 
      value: "fashion-photography", 
      label: "Fashion Photography", 
      icon: Camera, 
      description: "Master fashion photography with Rohit Suri.",
      details: `Mode: Offline
    Team size: Individual or group of 2
    Requirements:
    - DSLR with different lenses
    
    Eligibility: Anyone above the age of 18
    
    Overview:
    Step into the world of Fashion Photography, where style and storytelling unite through the lens. This workshop dives into the essentials of capturing fashion, from composition and lighting to model direction and styling. Perfect for beginners and enthusiasts alike, this experience will teach participants how to create impactful, magazine-worthy images that elevate their creative vision.
    
    Deliverables:
    - Technical Basics: Training in camera settings, lighting techniques, and composition specific to fashion
    - Styling & Model Direction: Tips and techniques on styling outfits and guiding models for expressive poses
    - Portfolio Shots: Each participant will shoot 2-3 styled looks for their portfolio
    - Editing Guide: An introduction to photo editing tools/softwares for fashion, with basic tips on enhancing images`
    },
  ],
  "November 22nd, 2024": [
    { 
      value: "biomimicry", 
      label: "Ways of Nature: Understanding Biomimicry", 
      icon: Newspaper, 
      description: "Explore paper techniques inspired by nature.",
      details: `Mode: Offline
    Team size: Individual or group
    Requirements:
    - Paper
    - Basic Stationery
    - Laptops (if Digital)
    
    Eligibility: Anyone above the age of 18
    
    Overview:
    This workshop challenges students and enthusiasts to express the theme "Ways of Nature" through different types of Paper techniques to replicate nature. The workshop seeks to explore the transformative power of design and how nature can inspire change, evolution and design.
    
    Deliverables:
    - Ideation sketches and final hand-drawn font sheets
    - Final Paper Artwork/design curated after the workshop
    - Brief description (50-100 words) explaining the design concept
    
    Rules:
    - Design should reflect the concepts of nature and biomimicry
    - Each participant/team may submit only one entry
    - Design submitted must be original creations
    - Plagiarism or copyright infringement will result in disqualification
    
    Evaluation Criteria:
    - Interpretation of the theme
    - Creativity and originality
    - Design aesthetics
    - Overall visual impact`
    },
    { 
      value: "space-design", 
      label: "Space Design 3D Architectural Model", 
      icon: Building, 
      description: "Create 3D architectural models with Ar. Pritam Lenka.",
      details: `Mode: Offline
    Team size: Individual or group of maximum 3
    Requirements:
    - Foam board, cardboard
    - Cutting mats, precision knives
    - Glue, rulers, pencils
    - Scale rulers
    - Basic cutting tools like utility knives
    - Metal-edged ruler
    
    Eligibility: Anyone above the age of 18
    
    Overview:
    Dive into the fundamentals of Space Design through hands-on architectural modeling. This workshop introduces participants to model-making techniques that translate spatial concepts into tangible, scaled representations. Perfect for aspiring designers, it provides foundational skills in visualizing, planning, and constructing architectural models.
    
    Deliverables:
    - Introduction to Space Design Principles: Basics of scale, proportion, and spatial planning
    - Model-Making Techniques: Step-by-step guidance on using tools and materials for architectural models
    - Scaled Model Project: Each participant will complete a scaled-down model of a room or simple structure
    - Material Selection Guide: Handout or PDF on materials, tools, and techniques for future projects`
    },
    
  ],
}

const workshopDates = Object.keys(workshops) as Array<keyof typeof workshops>;

export function EnhancedRegistrationFormComponent() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    organizationType: "",
    organizationName: "",
    competition: "",
    workshops: {
      "November 21st, 2024": "",
      "November 22nd, 2024": "",
    },
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (field: keyof FormData | string, value: string | Record<string, string>) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStep = () => {
    const newErrors: FormErrors = {}
    switch (step) {
      case 0:
        if (!formData.name) newErrors["name"] = "Name is required"
        if (!formData.email) newErrors["email"] = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors["email"] = "Invalid email format"
        if (!formData.phone) newErrors["phone"] = "Phone number is required"
        else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors["phone"] = "Invalid Indian phone number"
        break
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
      setStep((prev) => Math.min(prev + 1, formSteps.length - 1))
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
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
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#212120]">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#460E2F]" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className="pl-10 border-[#D2DDDE] focus:border-[#460E2F] focus:ring-[#460E2F]"
                />
              </div>
              {errors["name"] && (
                <p className="text-[#9A1B22] text-sm">{errors["name"]}</p>
              )}
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
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="pl-10 border-[#D2DDDE] focus:border-[#460E2F] focus:ring-[#460E2F]"
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
              <Label className="text-[#212120]">Organization Type</Label>
              <RadioGroup
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
                   "Organization Name"}
                </Label>
                <Input
                  id="organizationName"
                  placeholder={`Enter your ${formData.organizationType === "school" ? "school" :
                                            formData.organizationType === "college" ? "college" :
                                            "organization"} name`}
                  value={formData.organizationName}
                  onChange={(e) => updateFormData("organizationName", e.target.value)}
                  className="border-[#D2DDDE] focus:border-[#460E2F] focus:ring-[#460E2F]"
                />
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
  <DialogContent className="sm:max-w-[550px] bg-white shadow-xl border-0">
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
            <div key={index} className="text-[#212120]">
              <div className="flex items-center space-x-2 mb-3">
                {title.toLowerCase().includes('mode') && <Building className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('team') && <Users2Icon className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('categories') && <GraduationCap className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('deliverables') && <PackageIcon className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('problem') && <Lightbulb className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('rules') && <ScrollTextIcon className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('evaluation') && <CheckCircleIcon className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('duration') && <Clock className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('overview') && <BookOpen className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('theme') && <Palette className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('judges') && <Users2Icon className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('location') && <MapPin className="w-5 h-5 text-[#460E2F]" />}
                {title.toLowerCase().includes('requirements') && <WrenchIcon className="w-5 h-5 text-[#460E2F]" />}
                <h3 className="font-semibold text-lg text-[#460E2F]">{title}</h3>
              </div>
              <div className="space-y-2 ml-7">
                {content.map((line, i) => (
                  <div key={i} className="text-base leading-relaxed tracking-normal">
                    {line.startsWith('-') ? (
                      <div className="flex items-start space-x-2">
                        <span className="text-[#460E2F] mt-1.5">•</span>
                        <span className="text-[#212120]/90">
                          {line.substring(2).replace(/'/g, "&apos;")}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[#212120]/90">{line.replace(/'/g, "&apos;")}</p>
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
      <div className="flex items-center space-x-3 mb-6">
        <workshop.icon className="w-10 h-10 text-[#460E2F]" />
        <div>
          <DialogTitle className="text-[#460E2F] text-2xl font-bold">
            {workshop.label}
          </DialogTitle>
          <p className="text-[#212120]/70 text-base mt-1">{workshop.description}</p>
        </div>
      </div>
    </DialogHeader>
    <ScrollArea className="mt-4 max-h-[65vh]">
      <div className="space-y-8 pr-6">
        {/* Event Details Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-[#460E2F]" />
            <span className="text-[#460E2F] font-bold text-lg">Mode:</span> 
            <span className="font-semibold">Offline</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Users2Icon className="w-5 h-5 text-[#460E2F]" />
            <span className="text-[#460E2F] font-bold text-lg">Team size:</span>
            <span>Individual or group of 2</span>
          </div>

          <div className="flex items-center space-x-3">
            <UserCheckIcon className="w-5 h-5 text-[#460E2F]" />
            <span className="text-[#460E2F] font-bold text-lg">Judges:</span>
            <span>Mr. Sunil Shukla & Dr. Rushit Dubal</span>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-[#460E2F]" />
            <span className="text-[#460E2F] font-bold text-lg">Location:</span>
            <span>Theatre</span>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
            <WrenchIcon className="w-5 h-5 text-[#460E2F]" />
            <span className="text-[#460E2F] font-bold text-lg">Requirements:</span>
          </div>
          <ul className="ml-8 space-y-2">
            {workshop.details.match(/Requirements:([^]*?)(?=\n\n|\n[A-Z]|$)/s)?.[1]
              .split('\n')
              .filter(item => item.trim().startsWith('-'))
              .map((item, index) => (
                <li key={index} className="text-[#212120] flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#460E2F]" />
                  <span>{item.replace('-', '').trim()}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Categories Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
            <GraduationCap className="w-5 h-5 text-[#460E2F]" />
            <span className="text-[#460E2F] font-bold text-lg">Categories:</span>
          </div>
          <ul className="ml-8 space-y-2">
            <li className="text-[#212120] flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#460E2F]" />
              <span>10+2 & College Students</span>
            </li>
            <li className="text-[#212120] flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#460E2F]" />
              <span>Working professionals</span>
            </li>
          </ul>
        </div>

        {/* Deliverables Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
            <PackageIcon className="w-5 h-5 text-[#460E2F]" />
            <span className="text-[#460E2F] font-bold text-lg">Deliverables:</span>
          </div>
          <ul className="ml-8 space-y-2">
            {workshop.details.match(/Deliverables:([^]*?)(?=\n\n|\n[A-Z]|$)/s)?.[1]
              .split('\n')
              .filter(item => item.trim().startsWith('-'))
              .map((item, index) => (
                <li key={index} className="text-[#212120] flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#460E2F]" />
                  <span>{item.replace('-', '').trim()}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Overview Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
            <BookOpen className="w-5 h-5 text-[#460E2F]" />
            <span className="text-[#460E2F] font-bold text-lg">Overview:</span>
          </div>
          <p className="ml-8 text-[#212120] leading-relaxed">
            {workshop.details.match(/Overview:([^]*?)(?=\n\n|\n[A-Z]|$)/s)?.[1].trim()}
          </p>
        </div>

        {/* Rules Section (if present in workshop.details) */}
        {workshop.details.includes('Rules:') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
              <ScrollTextIcon className="w-5 h-5 text-[#460E2F]" />
              <span className="text-[#460E2F] font-bold text-lg">Rules:</span>
            </div>
            <ul className="ml-8 space-y-2">
              {workshop.details.match(/Rules:([^]*?)(?=\n\n|\n[A-Z]|$)/s)?.[1]
                .split('\n')
                .filter(item => item.trim().startsWith('-'))
                .map((item, index) => (
                  <li key={index} className="text-[#212120] flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#460E2F]" />
                    <span>{item.replace('-', '').trim()}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
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
                  <p className="text-sm text-[#212120]/70">{formData.name}</p>
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
                  <p className="text-lg text-[#460E2F]">We're excited to have you join us, {formData.name}!</p>
                  <p className="text-[#212120]">Keep an eye on your email for further details and updates about the festival.</p>
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
