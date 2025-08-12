'use client'

import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Star,
  Calendar,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle,
  Heart,
  Target,
  Globe,
  Sparkles
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useData } from '@/contexts/DataContext'

export default function Home() {
  const { getUpcomingEvents, getPublishedNews } = useData()
  
  const stats = [
    { number: '500+', label: 'Students', icon: Users },
    { number: '25+', label: 'Expert Teachers', icon: GraduationCap },
    { number: '95%', label: 'Success Rate', icon: Award },
    { number: '15+', label: 'Years Experience', icon: Calendar }
  ]

  const features = [
    {
      icon: BookOpen,
      title: 'CBSE Curriculum',
      description: 'Comprehensive CBSE curriculum following national education standards with modern teaching methodologies.'
    },
    {
      icon: Users,
      title: 'Expert Faculty',
      description: 'Experienced and qualified teachers dedicated to nurturing every child\'s potential and academic growth.'
    },
    {
      icon: Award,
      title: 'Academic Excellence',
      description: 'Consistent track record of outstanding board results and academic achievements year after year.'
    },
    {
      icon: Heart,
      title: 'Holistic Development',
      description: 'Focus on character building, leadership skills, and overall personality development alongside academics.'
    },
    {
      icon: Target,
      title: 'Individual Attention',
      description: 'Small class sizes ensuring personalized attention and support for every student\'s learning journey.'
    },
    {
      icon: Globe,
      title: 'Modern Facilities',
      description: 'Well-equipped classrooms, laboratories, library, and sports facilities for comprehensive education.'
    }
  ]

  const teachers = [
    {
      name: 'Mrs. Priya Sharma',
      subject: 'Mathematics',
      experience: '12 years',
      image: '/images/teacher-1.jpg',
      qualification: 'M.Sc. Mathematics, B.Ed'
    },
    {
      name: 'Mr. Rajesh Patel',
      subject: 'Science',
      experience: '15 years',
      image: '/images/teacher-2.jpg',
      qualification: 'M.Sc. Physics, B.Ed'
    },
    {
      name: 'Mrs. Meera Desai',
      subject: 'English',
      experience: '10 years',
      image: '/images/teacher-3.jpg',
      qualification: 'M.A. English, B.Ed'
    },
    {
      name: 'Mr. Amit Kumar',
      subject: 'Social Studies',
      experience: '8 years',
      image: '/images/teacher-4.jpg',
      qualification: 'M.A. History, B.Ed'
    }
  ]

  // Get dynamic events from context
  const dynamicEvents = getUpcomingEvents()
  
  // Fallback events if no dynamic events are available
  const fallbackEvents = [
    {
      title: 'Annual Sports Day',
      date: 'December 15, 2024',
      description: 'A day filled with athletic competitions, team sports, and celebration of physical excellence.',
      image: '/images/kids.jpg'
    },
    {
      title: 'Science Exhibition',
      date: 'January 20, 2025',
      description: 'Students showcase their innovative projects and scientific discoveries.',
      image: '/images/infra.jpg'
    },
    {
      title: 'Cultural Festival',
      date: 'February 10, 2025',
      description: 'Celebration of arts, music, dance, and cultural diversity through performances.',
      image: '/images/principal.jpeg'
    }
  ]

  // Use dynamic events if available, otherwise use fallback
  const events = dynamicEvents.length > 0 
    ? dynamicEvents.map(event => ({
        title: event.title,
        date: new Date(event.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        description: event.description,
        image: '/images/kids.jpg' // Default image for events
      }))
    : fallbackEvents

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Parent',
      content: 'My daughter has grown tremendously since joining Apple Public School. The teachers are caring and the academic standards are excellent.',
      rating: 5,
      image: '/images/kids.jpg'
    },
    {
      name: 'Rajesh Patel',
      role: 'Parent',
      content: 'The school provides a perfect balance of academics and extracurricular activities. My son loves coming to school every day.',
      rating: 5,
      image: '/images/teacher-1.jpg'
    },
    {
      name: 'Meera Desai',
      role: 'Parent',
      content: 'Excellent infrastructure and dedicated teachers. The school focuses on overall development of children.',
      rating: 5,
      image: '/images/teacher-2.jpg'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <GraduationCap className="w-16 h-16 text-yellow-400 mb-4" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="heading-primary text-white mb-6"
              >
                Welcome to Apple Public School
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-gray-200 mb-8"
              >
                Nurturing minds, building character, and shaping futures. 
                Join us in providing quality education that prepares students for life's challenges.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/contact" className="btn-secondary">
                  Apply for Admission
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/images/hero.png"
                alt="Apple Public School Students"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-dark-900 mb-2">{stat.number}</div>
                <div className="text-dark-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Why Choose Apple Public School?</h2>
            <p className="text-body max-w-3xl mx-auto">
              We focus on holistic development with experienced teachers, modern facilities, and a nurturing environment that prepares students for life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-dark-900 mb-3">{feature.title}</h3>
                <p className="text-dark-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Our School Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-secondary mb-6">About Our School</h2>
              <p className="text-body mb-6">
                Apple Public School has been providing quality education since 2009. We are committed to academic excellence and character development, 
                creating a nurturing environment where every child can thrive and reach their full potential.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-dark-700">CBSE affiliated institution</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-dark-700">Experienced and qualified teachers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-dark-700">Modern infrastructure and facilities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-dark-700">Holistic development approach</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/about" className="btn-primary">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/images/kids.jpg"
                alt="Students at Apple Public School"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Expert Teachers Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Our Expert Teachers</h2>
            <p className="text-body max-w-3xl mx-auto">
              Meet our dedicated team of experienced educators who are committed to nurturing every child's potential and academic growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{teacher.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{teacher.subject}</p>
                <p className="text-sm text-dark-600 mb-2">{teacher.qualification}</p>
                <p className="text-sm text-dark-500">{teacher.experience} experience</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Upcoming Events</h2>
            <p className="text-body max-w-3xl mx-auto">
              Stay updated with our latest school events, activities, and celebrations that enrich the learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-primary-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-dark-900 mb-3">{event.title}</h3>
                  <p className="text-dark-600 mb-4">{event.description}</p>
                  <Link href="/gallery" className="text-primary-600 hover:text-primary-700 font-medium">
                    Learn More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">What Parents Say</h2>
            <p className="text-body max-w-3xl mx-auto">
              Hear from our satisfied parents about their experience with Apple Public School.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-900">{testimonial.name}</h4>
                    <p className="text-sm text-dark-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-dark-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary text-white mb-4">Ready to Join Our School?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Give your child the best start in life with quality education and holistic development at Apple Public School.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Apply for Admission
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

