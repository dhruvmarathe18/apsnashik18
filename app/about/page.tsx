'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Cpu, 
  Brain, 
  Zap, 
  Users, 
  Award, 
  BookOpen, 
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function About() {
  const milestones = [
    { year: '2009', title: 'School Founded', description: 'Apple Public School established with a vision to provide quality education' },
    { year: '2015', title: 'CBSE Affiliation', description: 'Successfully affiliated with CBSE board for comprehensive education' },
    { year: '2020', title: 'Infrastructure Upgrade', description: 'Modernized facilities and enhanced learning environment' },
    { year: '2024', title: 'Excellence in Education', description: 'Recognized as one of the leading schools in Nashik district' }
  ]

  const aiFeatures = [
    {
      icon: Cpu,
      title: 'Modern Teaching Methods',
      description: 'Innovative teaching approaches that engage students and enhance learning outcomes'
    },
    {
      icon: Brain,
      title: 'Personalized Learning',
      description: 'Individual attention and customized learning approaches for each student'
    },
    {
      icon: Zap,
      title: 'Technology Integration',
      description: 'Smart classrooms and digital resources to support modern education'
    },
    {
      icon: Users,
      title: 'Experienced Faculty',
      description: 'Qualified and dedicated teachers committed to student success'
    }
  ]

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'Striving for academic excellence and continuous improvement in all areas'
    },
    {
      icon: Award,
      title: 'Quality Education',
      description: 'Providing high-quality education that prepares students for future challenges'
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Creating an inclusive environment where every student can thrive'
    },
    {
      icon: BookOpen,
      title: 'Lifelong Learning',
      description: 'Instilling a passion for learning and personal growth'
    }
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
            <Sparkles className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="heading-primary mb-4"
          >
            About Our School
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Providing quality education with modern teaching methodologies and strong values.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding" id="story">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-secondary mb-6">Our Journey</h2>
              <p className="text-body mb-6">
                Apple Public School Nashik has continuously evolved to adopt modern teaching practices while maintaining
                the highest academic standards.
              </p>
              <p className="text-body mb-6">
                What started as a traditional CBSE school has grown into a contemporary learning environment with
                student-centered teaching methods, continuous innovation, and unwavering commitment
                to academic excellence.
              </p>
              <p className="text-body mb-8">
                Today, we stand as a beacon of educational growth, embracing useful technology while maintaining the
                warmth and personal touch that makes education truly meaningful.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/images/principal.jpeg"
                alt="Modern Learning Environment"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Established</p>
                    <p className="font-semibold text-dark-900">2009</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section-padding bg-gray-50" id="vision">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Vision & Mission</h2>
            <p className="text-body max-w-3xl mx-auto">
              Shaping the future of education through innovation and academic excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4">Our Vision</h3>
              <p className="text-body">
                To be a leading educational institution that prepares students for the future
                through strong academics, character development, and modern learning environments.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4">Our Mission</h3>
              <p className="text-body">
                To provide a modern education that combines academic excellence with
                holistic development. We are committed to nurturing curious minds, fostering
                creativity, and developing future-ready skills.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section-padding" id="features">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Key Features</h2>
            <p className="text-body max-w-3xl mx-auto">
              Discover what makes learning at APS Nashik effective and engaging.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => (
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

      {/* Timeline Section */}
      <section className="section-padding bg-gray-50" id="history">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Our Innovation Timeline</h2>
            <p className="text-body max-w-3xl mx-auto">
              A journey of continuous evolution and technological advancement.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="card p-6">
                      <h3 className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</h3>
                      <h4 className="text-xl font-semibold text-dark-900 mb-2">{milestone.title}</h4>
                      <p className="text-dark-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className="w-8 h-8 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding" id="values">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Our Core Values</h2>
            <p className="text-body max-w-3xl mx-auto">
              The principles that guide our educational approach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold text-dark-900 mb-3">{value.title}</h3>
                <p className="text-dark-600">{value.description}</p>
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
            <h2 className="heading-secondary text-white mb-4">Join Our School Community</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Be part of a thriving learning community focused on academic excellence and holistic development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Apply for Admission
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/gallery" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                View Our Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
