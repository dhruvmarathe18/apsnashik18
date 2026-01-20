'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Users, 
  Award, 
  BookOpen, 
  Target,
  CheckCircle,
  ArrowRight,
  Heart,
  GraduationCap,
  Globe
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import CloudinaryImage from '@/components/ui/CloudinaryImage'

export default function About() {
  const milestones = [
    { year: '2009', title: 'School Founded', description: 'Apple Public School established with a vision to provide quality education' },
    { year: '2015', title: 'CBSE Affiliation', description: 'Successfully affiliated with CBSE board for comprehensive education' },
    { year: '2020', title: 'Infrastructure Upgrade', description: 'Modernized facilities and enhanced learning environment' },
    { year: '2024', title: 'Excellence in Education', description: 'Recognized as one of the leading schools in Nashik district' }
  ]

  const features = [
    {
      icon: BookOpen,
      title: 'Modern Teaching Methods',
      description: 'Innovative teaching approaches that engage students and enhance learning outcomes'
    },
    {
      icon: Users,
      title: 'Experienced Faculty',
      description: 'Qualified and dedicated teachers committed to student success'
    },
    {
      icon: Award,
      title: 'Academic Excellence',
      description: 'Consistent track record of outstanding board results and achievements'
    },
    {
      icon: Heart,
      title: 'Holistic Development',
      description: 'Focus on character building, leadership skills, and overall personality development'
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Modern Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl mb-6"
            >
              <GraduationCap className="w-10 h-10 text-primary-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              About Our School
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Empowering students with the skills, courage, optimism, and integrity to pursue their dreams and enhance the lives of others.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white" id="story">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Apple Public School Nashik began its journey in 2009 with a vision to provide quality education 
                that combines academic excellence with holistic development. What started as a small educational institution 
                has evolved into one of the leading schools in Nashik district.
              </p>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Our journey from a traditional CBSE school to a modern learning environment has been marked by continuous 
                innovation and unwavering commitment to student success. We believe in nurturing every child's potential 
                while maintaining the warmth and personal touch that makes education truly meaningful.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Today, we stand as a beacon of educational excellence, demonstrating how quality education can transform 
                lives and prepare students for the challenges of tomorrow.
              </p>
              <div className="space-y-4">
                {[
                  'CBSE affiliated institution',
                  'Experienced and qualified teachers',
                  'Modern infrastructure and facilities',
                  'Holistic development approach'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <CloudinaryImage
                  src="aps-nashik/hero-images"
                  alt="Apple Public School"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  cloudinaryOptions={{
                    quality: 'auto',
                    format: 'auto',
                  }}
                  fallbackSrc="/images/principal.jpeg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                    <Award className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Established</p>
                    <p className="text-2xl font-bold text-gray-900">2009</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-gray-50" id="vision">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Vision & Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the leading educational institution that prepares students for a future where they can 
                seamlessly integrate into every aspect of life and work. We envision a world where every child 
                has access to personalized learning experiences that unlock their full potential.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To provide quality education that combines academic excellence with holistic development. 
                We are committed to nurturing curious minds, fostering creativity, and developing future-ready 
                skills through personalized learning experiences and modern teaching methodologies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Makes Us Special</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what sets Apple Public School apart in providing quality education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-white border border-gray-200 rounded-2xl hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50" id="history">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A timeline of continuous growth and educational excellence.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-3xl font-bold text-primary-600 mb-2">{milestone.year}</h3>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-primary-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white" id="values">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our educational approach and shape our school community.
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
                className="bg-white p-8 border border-gray-200 rounded-2xl text-center group hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-500 group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-8 h-8 text-secondary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our School Community
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
              Be part of a school that values excellence, innovation, and holistic development. 
              Experience how quality education can transform lives and unlock potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="group bg-white hover:bg-gray-50 text-primary-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/gallery" 
                className="group bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>View Our Gallery</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
