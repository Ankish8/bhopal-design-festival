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
import type { LucideIcon } from 'lucide-react';
import { 
  Building, 
  Trophy, 
  BookOpen, 
  Check, 
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

interface FormData {
  name: string;
  email: string;
  phone: string;
  organizationType: string;
  organizationName: string;
  competition: string;
  workshops: {
    "November 21st, 2024": string;
    "November 22nd, 2024": string;
  };
}

interface FormErrors {
  [key: string]: string;
}

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
Team size: 4-5 members
Categories:
- 10+2 & College Students
- Working professionals

Deliverables:
- Paper prototype
- Brief description (50-100 words)
- Final design process

Problem statements include topics on student motivation, helping beggars, artist product sales, student meals, and Bhopal city guide.

Duration: November 21st-23rd morning`
  },
  { 
    value: "visual-storytelling", 
    label: "Visual Storytelling", 
    icon: Camera, 
    description: "Create a compelling photo story.",
    details: `Mode: Offline
Team size: Maximum 4 members
Judges: Mr. Sunil Shukla & Dr. Rushit Dubal
Requirements: DSLR/Digital Camera/Mobile Phone with good camera, Basic Stationery
Categories:
- 10+2 & College Students
- Working professionals

Deliverables:
- 5-7 images photo story
- Title and brief description (50-100 words)
- Photo layout presentation
- Optional: Behind-the-scenes write-up`
  },
]

const workshops: Workshops = {
  "November 21st, 2024": [
    { 
      value: "printmaking", 
      label: "Printmaking Workshop", 
      icon: Palette, 
      description: "Learn LinoCut techniques with Ravindra Shankar Roy.",
      details: `Mode: Offline
Team size: Individual or pair
Requirements: Paper, Basic Stationery, Lino cut tools
Deliverables:
- LinoCut Techniques demonstration
- Personal artwork creation
- 2-3 final prints (single-color and multi-layered)
- Lino Carving Skills Guide`
    },
    { 
      value: "fashion-photography", 
      label: "Fashion Photography", 
      icon: Camera, 
      description: "Master fashion photography with Rohit Suri.",
      details: `Mode: Offline
Team size: Individual or pair
Requirements: DSLR with different lenses
Deliverables:
- Technical camera training
- Styling & model direction skills
- 2-3 portfolio shots
- Photo editing guide`
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
Requirements: Paper, Basic Stationery, Laptops (if digital)
Deliverables:
- Ideation sketches
- Final hand-drawn font sheets
- Final Paper Artwork/design
- Brief description (50-100 words)`
    },
    { 
      value: "space-design", 
      label: "Space Design 3D Architectural Model", 
      icon: Building, 
      description: "Create 3D architectural models with Ar. Pritam Lenka.",
      details: `Mode: Offline
Team size: Individual or group of max 3
Requirements: Foam board, cardboard, cutting mats, precision knives, glue, rulers, pencils, scale rulers
Deliverables:
- Space design principles introduction
- Model-making techniques
- Scaled model project
- Material selection guide`
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

  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true)
      try {
        // Prepare the data for Make.com
        const makeData = {
          ...formData,
          competitionName: competitions.find(c => c.value === formData.competition)?.label || "",
          workshopsSelected: workshopDates.map((date) => ({
            date,
            workshop: workshops[date].find(w => w.value === formData.workshops[date])?.label || "None selected"
          })),
          submissionDate: new Date().toISOString(),
        }

        // Send data to Make.com webhook
        const response = await fetch('https://hook.eu2.make.com/bone3wxkg21torr3n096m4x6gw36lys1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(makeData)
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        console.log('Form submitted successfully');
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
                            <p  className="text-sm text-[#212120]/70">{competition.description}</p>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-[#460E2F] text-[#460E2F] hover:bg-[#D2DDDE]/20">
                              <Info className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white">
  <DialogHeader className="pb-4">
    <DialogTitle className="text-[#460E2F] text-xl font-semibold">{competition.label}</DialogTitle>
  </DialogHeader>
  <ScrollArea className="mt-2 max-h-[60vh] overflow-auto pr-4">
    <div className="space-y-4">
      {competition.details.split('\n\n').map((section, index) => {
        const [title, ...content] = section.split('\n');
        return (
          <div key={index} className="text-[#212120]">
            <div className="font-medium mb-1">{title}</div>
            {content.map((line, i) => (
              <div key={i} className="text-sm leading-relaxed ml-4">
                {line.startsWith('-') ? (
                  <span className="flex">
                    <span className="mr-2">•</span>
                    {line.substring(2)}
                  </span>
                ) : line}
              </div>
            ))}
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
                            <DialogContent className="sm:max-w-[425px] bg-white">
  <DialogHeader className="pb-4">
    <DialogTitle className="text-[#460E2F] text-xl font-semibold">{workshop.label}</DialogTitle>
  </DialogHeader>
  <ScrollArea className="mt-2 max-h-[60vh] overflow-auto pr-4">
    <div className="space-y-4">
      {workshop.details.split('\n\n').map((section, index) => {
        const [title, ...content] = section.split('\n');
        return (
          <div key={index} className="text-[#212120]">
            <div className="font-medium mb-1">{title}</div>
            {content.map((line, i) => (
              <div key={i} className="text-sm leading-relaxed ml-4">
                {line.startsWith('-') ? (
                  <span className="flex">
                    <span className="mr-2">•</span>
                    {line.substring(2)}
                  </span>
                ) : line}
              </div>
            ))}
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D2DDDE] via-white to-[#D2DDDE] p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-[#460E2F]">Thank You!</CardTitle>
              <CardDescription className="text-center text-[#212120]">Your registration for the Bhopal Design Festival is complete.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-lg text-[#460E2F]">We&apos;re excited to have you join us, {formData.name}!</p>
                <p className="text-[#212120]">Keep an eye on your email for further details and updates about the festival.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D2DDDE] p-4">
      <div className="w-full max-w-2xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-[#460E2F]">Bhopal Design Festival</h1>
          <p className="text-xl text-[#212120] mt-2">2nd Edition</p>
          <p className="text-lg text-[#212120] mt-1">21st - 23rd November 2024</p>
        </motion.div>
        <Card className="w-full bg-white border-[#460E2F]/10 shadow-lg">
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-auto"
              >
                <Button 
                  onClick={nextStep} 
                  className="bg-[#460E2F] hover:bg-[#460E2F]/90 text-white"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-auto"
              >
<Button 
  onClick={handleSubmit} 
  className="bg-[#F68B29] hover:bg-[#F68B29]/90 text-white"
  disabled={isSubmitting}
>
  {isSubmitting ? "Submitting..." : "Submit Registration"} <Check className="ml-2 h-4 w-4" />
</Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}