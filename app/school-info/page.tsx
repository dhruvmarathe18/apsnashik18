'use client'

import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Users, 
  Award, 
  BookOpen,
  GraduationCap,
  Building,
  Car,
  Wifi,
  Shield,
  Heart,
  Sparkles,
  CheckCircle,
  Globe,
  Calendar,
  DollarSign,
  Target
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function SchoolInfo() {
  const schoolDetails = {
    name: 'Apple Public School',
    address: 'In Front Of Vijay Steel, Pimpalgaon Baswant, Nashik, Maharashtra',
    phone: '+91 253-1234567',
    email: 'info@apsnashik.com',
    website: 'www.apsnashik.com',
    rating: 4.8,
    reviews: 156,
    established: 2009,
    board: 'CBSE',
    grades: 'Nursery to Class 12',
    medium: 'English',
    type: 'Co-educational'
  }

  const facilities = [
    { icon: Building, name: 'Modern Infrastructure', description: 'Well-maintained classrooms with modern teaching aids and comfortable learning environment' },
    { icon: Wifi, name: 'Smart Classrooms', description: 'Interactive whiteboards and digital learning resources for enhanced teaching' },
    { icon: Car, name: 'Transportation', description: 'Safe and comfortable school transport services covering nearby areas' },
    { icon: Shield, name: 'Security', description: '24/7 security with CCTV surveillance ensuring student safety' },
    { icon: Heart, name: 'Medical Room', description: 'On-campus medical facility with trained staff for immediate care' },
    { icon: Globe, name: 'Computer Lab', description: 'Well-equipped computer laboratory with modern technology' },
    { icon: BookOpen, name: 'Library', description: 'Extensive library with books, reference materials, and study space' },
    { icon: Users, name: 'Sports Complex', description: 'Multi-sport facilities including playground, indoor games, and sports equipment' }
  ]

  const academicInfo = [
    { title: 'Curriculum', value: 'CBSE (Central Board of Secondary Education)', icon: BookOpen },
    { title: 'Teaching Medium', value: 'English', icon: Globe },
    { title: 'Student-Teacher Ratio', value: '25:1', icon: Users },
    { title: 'School Type', value: 'Co-educational Day School', icon: GraduationCap },
    { title: 'Classes Offered', value: 'Nursery to Class 12', icon: Calendar },
    { title: 'Academic Year', value: 'April to March', icon: Calendar }
  ]

  const admissionInfo = [
    { title: 'Admission Process', description: 'Simple application process with required documentation and school visit' },
    { title: 'Required Documents', description: 'Birth certificate, previous school records, address proof, and photographs' },
    { title: 'Age Criteria', description: 'As per CBSE guidelines for each class level' },
    { title: 'Entrance Test', description: 'Basic assessment to understand student\'s current academic level' },
    { title: 'Interview', description: 'Parent and student interaction with school authorities' },
    { title: 'Fee Structure', description: 'Competitive fees with flexible payment options and sibling discounts' }
  ]

  const achievements = [
    { year: '2024', title: 'Academic Excellence Award', description: 'Outstanding performance in CBSE board examinations' },
    { year: '2023', title: 'Best CBSE School in Nashik', description: 'Recognition for overall school performance and student achievements' },
    { year: '2022', title: 'Sports Excellence Award', description: 'Achievements in district and state level sports competitions' },
    { year: '2021', title: 'Cultural Excellence Award', description: 'Recognition for cultural activities and student performances' },
    { year: '2020', title: 'Innovation in Education', description: 'Implementation of modern teaching methodologies and student engagement' }
  ]

  const reviews = [
    { name: 'Priya Sharma', rating: 5, comment: 'Excellent learning environment. My daughter has shown remarkable improvement in academics and confidence.', date: '2 weeks ago' },
    { name: 'Rajesh Patel', rating: 5, comment: 'The school provides a perfect balance of academics and extracurricular activities. Highly recommended!', date: '1 month ago' },
    { name: 'Meera Desai', rating: 4, comment: 'Great infrastructure and dedicated teachers. The school focuses on overall development.', date: '2 months ago' },
    { name: 'Amit Kumar', rating: 5, comment: 'Best school in Nashik for quality education. The teachers are caring and supportive.', date: '3 months ago' }
  ]

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: 'In Front Of Vijay Steel, Pimpalgaon Baswant, Nashik, Maharashtra 422003', link: '#' },
    { icon: Phone, label: 'Phone', value: '+91 253-1234567', link: 'tel:+912531234567' },
    { icon: Mail, label: 'Email', value: 'info@apsnashik.com', link: 'mailto:info@apsnashik.com' },
    { icon: Globe, label: 'Website', value: 'www.apsnashik.com', link: 'https://www.apsnashik.com' },
    { icon: Clock, label: 'Office Hours', value: 'Monday - Friday: 8:00 AM - 4:00 PM', link: '#' }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Building className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="heading-primary mb-4"
          >
            School Information & Details
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Complete information about Apple Public School - Your gateway to excellent education in Nashik.
          </motion.p>
        </div>
      </section>

      {/* School Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-secondary mb-6">About Apple Public School</h2>
              <p className="text-body mb-6">
                Apple Public School, located in Pimpalgaon Baswant, Nashik, is a premier CBSE institution 
                that has been at the forefront of educational innovation since 2009. We are proud to be 
                the first school in Nashik to integrate artificial intelligence into our curriculum, 
                preparing students for the future of education and work.
              </p>
              <p className="text-body mb-6">
                Our learning environment combines traditional academic excellence with 
                cutting-edge technology, ensuring that every student develops critical thinking, 
                creativity, and digital literacy skills essential for the 21st century.
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-dark-900">{schoolDetails.rating}</span>
                </div>
                <span className="text-dark-600">({schoolDetails.reviews} reviews)</span>
              </div>
              <Link href="/contact" className="btn-primary">
                Apply for Admission
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Quick Information</h3>
              <div className="space-y-4">
                {Object.entries(schoolDetails).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-dark-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-dark-900">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Academic Information */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Academic Information</h2>
            <p className="text-body max-w-3xl mx-auto">
              Comprehensive details about our academic programs and curriculum structure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academicInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-900">{info.title}</h3>
                </div>
                <p className="text-dark-600">{info.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Facilities</h2>
            <p className="text-body max-w-3xl mx-auto">
              State-of-the-art facilities designed to support holistic development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <facility.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-3">{facility.name}</h3>
                <p className="text-dark-600 text-sm">{facility.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Information */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Admission Information</h2>
            <p className="text-body max-w-3xl mx-auto">
              Everything you need to know about joining our learning community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {admissionInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-dark-900 mb-3">{info.title}</h3>
                <p className="text-dark-600">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Awards & Achievements</h2>
            <p className="text-body max-w-3xl mx-auto">
              Recognition of our commitment to excellence in education.
            </p>
          </motion.div>

          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.year}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl font-bold text-primary-600">{achievement.year}</span>
                      <h3 className="text-xl font-semibold text-dark-900">{achievement.title}</h3>
                    </div>
                    <p className="text-dark-600">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Parent Reviews</h2>
            <p className="text-body max-w-3xl mx-auto">
              What parents say about our educational approach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-dark-600 mb-4">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-dark-900">{review.name}</span>
                  <span className="text-sm text-dark-500">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Contact Information</h2>
            <p className="text-body max-w-3xl mx-auto">
              Get in touch with us for more information about our programs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <contact.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{contact.label}</h3>
                <a
                  href={contact.link}
                  className="text-dark-600 hover:text-primary-600 transition-colors"
                >
                  {contact.value}
                </a>
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
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Experience quality education with modern facilities and experienced teachers. 
              Apply now and give your child the advantage they deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Apply for Admission
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
