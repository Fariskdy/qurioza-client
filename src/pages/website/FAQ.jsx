import { useState } from "react";
import { SimpleFooter } from "@/components/SimpleFooter";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  ChevronDown,
  BookOpen,
  CreditCard,
  Laptop,
  GraduationCap,
  Users,
  Shield,
} from "lucide-react";

export function FAQ() {
  const [openCategory, setOpenCategory] = useState("general");
  const [openQuestions, setOpenQuestions] = useState([]);

  const toggleQuestion = (id) => {
    setOpenQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: "general", label: "General", icon: HelpCircle },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "pricing", label: "Pricing", icon: CreditCard },
    { id: "technical", label: "Technical", icon: Laptop },
    { id: "certificates", label: "Certificates", icon: GraduationCap },
    { id: "account", label: "Account", icon: Users },
  ];

  const faqData = {
    general: [
      {
        id: "what-is-qurioza",
        question: "What is Qurioza?",
        answer:
          "Qurioza is an online learning platform that offers high-quality tech courses. Our platform combines expert instruction, hands-on projects, and a supportive community to help you master new skills.",
      },
      {
        id: "how-to-start",
        question: "How do I get started?",
        answer:
          "Getting started is easy! Simply create a free account, browse our course catalog, and enroll in any course that interests you. You can begin learning immediately after enrollment.",
      },
      {
        id: "learning-format",
        question: "What is the learning format?",
        answer:
          "Our courses combine video lectures, interactive exercises, hands-on projects, and quizzes. You'll have access to course materials 24/7 and can learn at your own pace.",
      },
    ],
    courses: [
      {
        id: "course-duration",
        question: "How long does each course take to complete?",
        answer:
          "Course duration varies depending on the complexity and depth of the material. Most courses take 4-12 weeks to complete when studying 5-10 hours per week.",
      },
      {
        id: "prerequisites",
        question: "Are there any prerequisites for courses?",
        answer:
          "Prerequisites vary by course. While some beginner courses have no prerequisites, advanced courses may require specific knowledge or skills. Each course page lists any prerequisites.",
      },
    ],
    // Add more categories and questions as needed
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50" />
        <div className="absolute inset-0 bg-grid-black/[0.02]" />

        <div className="container relative px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 px-4 py-1.5 backdrop-blur-sm">
              <HelpCircle className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600">
                Frequently Asked Questions
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              How can we help you?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Find answers to common questions about our platform, courses, and
              learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="container px-4 md:px-6 py-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={openCategory === id ? "default" : "outline"}
              className="gap-2"
              onClick={() => setOpenCategory(id)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </section>

      {/* FAQ Questions */}
      <section className="container px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqData[openCategory]?.map(({ id, question, answer }) => (
            <div
              key={id}
              className="rounded-lg border bg-card transition-colors hover:bg-accent/50"
            >
              <button
                className="flex w-full items-center justify-between p-4 md:p-6"
                onClick={() => toggleQuestion(id)}
              >
                <span className="flex items-center gap-4">
                  <Shield className="h-5 w-5 text-violet-600" />
                  <span className="text-lg font-medium text-left">
                    {question}
                  </span>
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                    openQuestions.includes(id) ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openQuestions.includes(id) && (
                <div className="border-t px-4 py-4 md:px-6 md:py-6">
                  <p className="text-muted-foreground">{answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="border-t bg-zinc-50/50">
        <div className="container px-4 md:px-6 py-12 md:py-16">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight">
              Still have questions?
            </h2>
            <p className="text-lg text-muted-foreground">
              Can&apos;t find the answer you&apos;re looking for? Please chat with our
              friendly support team.
            </p>
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}
