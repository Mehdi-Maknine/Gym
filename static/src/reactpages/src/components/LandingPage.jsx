import React, { useState, useEffect } from "react";
import { useNavigate,BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import LoginPage from "../pages/LoginPage";
import { Badge } from "./ui/badge";
import Dashboard from "../pages/Dashboard";
import { 
  Dumbbell, 
  Users, 
  Clock, 
  Target, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight,
  Play,
  Award,
  Heart,
  Zap
} from "lucide-react";







const LandingPage = () => {

  
  <Router>
    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      { <Route path="/my/dashboard" element={<Dashboard />} /> }
    </Routes>
  </Router>
  const navigate = useNavigate();
  
  const getProgramIcon = (index) => {
  const icons = [<Dumbbell className="w-8 h-8" />, <Heart className="w-8 h-8" />, <Users className="w-8 h-8" />, <Target className="w-8 h-8" />];
    return icons[index % icons.length];
  };

  const [programs, setPrograms] = useState([]);
  useEffect(() => {
  fetch("http://localhost:8069/api/programs")
    .then((res) => res.json())
    .then((data) => {
      if (data.programs) {
        setPrograms(
          data.programs.map((p, index) => ({
            title: p.name,
            description: p.description,
            icon: getProgramIcon(index),  // helper to assign icon
            features: [] // You can optionally add defaults or remove this
          }))
        );
      }
    })
    .catch((err) => {
      console.error("Failed to fetch programs:", err);
    });
}, []);



  const [memberships, setMemberships] = useState([]);
  useEffect(() => {
  fetch("http://localhost:8069/api/memberships")
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched from Odoo:", data);
      if (data.memberships) {
        setMemberships(data.memberships.map(plan => ({
          name: plan.name,
          price: `${plan.price.toFixed(2)}d.t`,
          period: `/${plan.duration_label}`,
          features: [
            ...(plan.description ? [plan.description] : []),
            `Per-day: $${plan.per_day_cost.toFixed(2)}`,
            `${plan.member_count} active users`
          ],
          popular: plan.name.toLowerCase().includes("premium")
        })));
      }
    })
    .catch(err => console.error("Failed to fetch memberships:", err));
}, []);

  const [tips, setTips] = useState([]);
  useEffect(() => {
  fetch("http://localhost:8069/api/tips?category=general")
    .then((res) => res.json())
    .then((data) => {
      if (data.tips) {
        setTips(data.tips.map(t => ({
          title: t.title,
          description: t.description,
          image: t.image, // base64 string, can be rendered as src
          category: t.category
        })));
      }
    })
    .catch((err) => {
      console.error("Failed to fetch tips:", err);
    });
}, []);



  const [trainers, setTrainers] = useState([]);
  useEffect(() => {
  fetch("http://localhost:8069/api/trainers")
    .then((res) => res.json())
    .then((data) => {
      if (data.trainers) {
        setTrainers(
          data.trainers.map((t) => ({
            name: t.name,
            specialty: t.specialty,
            experience: `${t.member_count} members`,
            certifications: t.certifications || []
          }))
        );
      }
    })
    .catch((err) => {
      console.error("Failed to fetch trainers:", err);
    });
}, []);



  return (
    <div className="min-h-screen bg-gym-dark text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gym-dark/90 backdrop-blur-md border-b border-gym-gray">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-gym-orange" />
              <span className="text-2xl font-bold text-gradient">POWERFIT</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#programs" className="hover:text-gym-orange transition-colors">Programs</a>
              <a href="#membership" className="hover:text-gym-orange transition-colors">Membership</a>
              <a href="#trainers" className="hover:text-gym-orange transition-colors">Trainers</a>
              <a href="#contact" className="hover:text-gym-orange transition-colors">Contact</a>
              <Button onClick={() => navigate("/login")} className="bg-gym-orange hover:bg-gym-red text-white font-semibold">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="animate-fade-in-up">
            <Badge className="mb-6 bg-gym-orange/20 text-gym-orange border-gym-orange">
              <Star className="w-4 h-4 mr-2" />
              #1 Rated Gym in the City
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              UNLEASH YOUR
              <span className="block text-gradient">INNER BEAST</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Transform your body, elevate your mind, and unlock your potential with our world-class facilities and expert trainers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/login")} size="lg" className="bg-gym-orange hover:bg-gym-red text-white font-semibold px-8 py-4 text-lg glow-orange">
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gym-dark px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Tour
              </Button>
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-gym-orange">500+</div>
            <div className="text-sm text-gray-400">Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gym-orange">15+</div>
            <div className="text-sm text-gray-400">Trainers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gym-orange">24/7</div>
            <div className="text-sm text-gray-400">Access</div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gym-gray">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient">Programs</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose from our comprehensive range of fitness programs designed to help you achieve your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="bg-gym-dark border-gym-gray hover-lift group cursor-pointer">
                <CardContent className="p-8">
                  <div className="text-gym-orange mb-4 group-hover:scale-110 transition-transform duration-300">
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{program.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{program.description}</p>
                  <ul className="space-y-2">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gym-orange rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-20 bg-gym-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-gradient">Membership</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Flexible plans designed to fit your lifestyle and fitness goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {memberships.map((plan, index) => (
              <Card key={index} className={`relative bg-gym-gray border-gym-gray hover-lift ${plan.popular ? 'ring-2 ring-gym-orange' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gym-orange text-white">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-4xl font-bold text-gym-orange">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-5 h-5 bg-gym-orange rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => navigate("/login")} className={`w-full ${plan.popular ? 'bg-gym-orange hover:bg-gym-red' : 'bg-gym-gray hover:bg-gym-orange'} text-white font-semibold`}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-20 bg-gym-gray">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our <span className="text-gradient">Expert Trainers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our certified professionals are here to guide you on your fitness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <Card key={index} className="bg-gym-dark border-gym-gray hover-lift group">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gym-orange to-gym-red rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
                  <p className="text-gym-orange font-semibold mb-2">{trainer.specialty}</p>
                  <p className="text-gray-400 text-sm mb-4">{trainer.experience} experience</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {trainer.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" className="border-gym-orange text-gym-orange">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      
      {/* Tips Section */}
      <section id="tips" className="py-20 bg-gym-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              Daily <span className="text-gradient">Workout Tips</span>
            </h2>
            <p className="text-gray-400 text-lg mt-2">Stay motivated and train smart every day.</p>
          </div>

          <div className="flex gap-6 overflow-x-auto py-4 px-2 scrollbar-hide">
            {tips.map((tip, idx) => (
              <Card
                key={idx}
                className="min-w-[300px] max-w-xs bg-gym-dark border border-gym-gray flex-shrink-0 hover-lift transition-shadow"
              >
                <CardContent className="p-6">
                  {tip.image && (
                    <img
                      src={`data:image/png;base64,${tip.image}`}
                      alt={tip.title}
                      className="rounded-xl mb-4 w-full object-cover h-40 border border-gym-gray"
                    />
                  )}
                  <h3 className="text-lg font-bold mb-2 text-white">{tip.title}</h3>
                  <p className="text-gray-400 text-sm">{tip.description}</p>
                  <Badge className="mt-4 bg-gym-orange/10 text-gym-orange border-gym-orange">
                    {tip.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gym-dark">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="text-gradient">Get Started?</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join hundreds of satisfied members who have transformed their lives at PowerFit. Your journey starts today.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gym-orange rounded-full flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-gray-400">123 Fitness Street, Downtown, City 12345</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gym-orange rounded-full flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Hours</h4>
                    <p className="text-gray-400">24/7 Access for Members</p>
                    <p className="text-gray-400 text-sm">Staff: Mon-Fri 6AM-10PM, Weekends 8AM-8PM</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gym-orange rounded-full flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Contact</h4>
                    <p className="text-gray-400">(555) 123-4567</p>
                    <p className="text-gray-400">info@powerfit.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-gym-gray border-gym-gray">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Start Your Free Trial</h3>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className="w-full p-3 bg-gym-dark border border-gym-gray rounded-lg text-white placeholder-gray-400 focus:border-gym-orange focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className="w-full p-3 bg-gym-dark border border-gym-gray rounded-lg text-white placeholder-gray-400 focus:border-gym-orange focus:outline-none"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full p-3 bg-gym-dark border border-gym-gray rounded-lg text-white placeholder-gray-400 focus:border-gym-orange focus:outline-none"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full p-3 bg-gym-dark border border-gym-gray rounded-lg text-white placeholder-gray-400 focus:border-gym-orange focus:outline-none"
                  />
                  <textarea 
                    placeholder="Tell us about your fitness goals" 
                    rows={4}
                    className="w-full p-3 bg-gym-dark border border-gym-gray rounded-lg text-white placeholder-gray-400 focus:border-gym-orange focus:outline-none resize-none"
                  ></textarea>
                  <Button onClick={() => navigate("/login")} className="w-full bg-gym-orange hover:bg-gym-red text-white font-semibold py-3">
                    Claim Your Free Trial
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Zap className="w-8 h-8 text-gym-orange" />
              <span className="text-2xl font-bold text-gradient">POWERFIT</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 PowerFit Gym. All rights reserved.</p>
              <p className="text-sm mt-1">Transform your life, one workout at a time.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
