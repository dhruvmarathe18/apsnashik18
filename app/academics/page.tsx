'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  Users, 
  Award, 
  Target,
  GraduationCap,
  Globe,
  Calendar,
  CheckCircle,
  Sparkles,
  Zap,
  Lightbulb,
  BarChart3,
  BookMarked,
  Code,
  Calculator,
  Microscope,
  Palette,
  Music,
  Dumbbell,
  Heart,
  ArrowRight
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Academics() {
  const curriculum = [
    {
      icon: BookOpen,
      title: 'CBSE Curriculum',
      description: 'Comprehensive CBSE curriculum following national education standards with modern teaching methodologies',
      features: ['Nursery to Class 12', 'National Standards', 'Digital Learning Tools', 'Continuous Assessment']
    },
    {
      icon: Brain,
      title: 'Modern Learning',
      description: 'Innovative teaching methods that engage students and enhance understanding',
      features: ['Interactive Learning', 'Student Engagement', 'Progress Tracking', 'Customized Support']
    },
    {
      icon: Globe,
      title: 'Holistic Development',
      description: 'Focus on academic excellence along with character building and life skills',
      features: ['Academic Excellence', 'Character Building', 'Life Skills', 'Leadership Development']
    }
  ]

  const subjects = [
    {
      category: 'Core Subjects',
      items: [
        { name: 'Mathematics', icon: Calculator, description: 'Strong foundation in mathematical concepts and problem-solving skills' },
        { name: 'Science', icon: Microscope, description: 'Practical learning with laboratory experiments and scientific inquiry' },
        { name: 'English', icon: BookMarked, description: 'Comprehensive language development and communication skills' },
        { name: 'Social Studies', icon: Globe, description: 'Understanding of history, geography, and civic responsibilities' }
      ]
    },
    {
      category: 'Additional Subjects',
      items: [
        { name: 'Computer Science', icon: Code, description: 'Basic computer skills and digital literacy for modern world' },
        { name: 'Physical Education', icon: Dumbbell, description: 'Sports activities and physical fitness development' },
        { name: 'Arts & Crafts', icon: Palette, description: 'Creative expression and artistic skills development' },
        { name: 'Music & Dance', icon: Music, description: 'Cultural activities and performing arts' }
      ]
    },
    {
      category: 'Life Skills',
      items: [
        { name: 'Communication', icon: Users, description: 'Effective communication and presentation skills' },
        { name: 'Leadership', icon: Award, description: 'Leadership qualities and team management skills' },
        { name: 'Critical Thinking', icon: Brain, description: 'Analytical thinking and problem-solving abilities' },
        { name: 'Values Education', icon: Heart, description: 'Moral values and ethical decision making' }
      ]
    }
  ]

  const teachingMethods = [
    {
      icon: Brain,
      title: 'Interactive Learning',
      description: 'Engaging teaching methods that involve students actively in the learning process',
      benefits: ['Student participation', 'Better understanding', 'Improved retention', 'Active learning']
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Group activities and peer learning to develop teamwork and social skills',
      benefits: ['Team building', 'Peer support', 'Social skills', 'Shared learning']
    },
    {
      icon: Target,
      title: 'Project-Based Learning',
      description: 'Hands-on projects that apply classroom knowledge to real-world situations',
      benefits: ['Practical application', 'Critical thinking', 'Problem solving', 'Creativity']
    },
    {
      icon: Zap,
      title: 'Technology Integration',
      description: 'Use of modern technology to enhance teaching and learning experiences',
      benefits: ['Digital literacy', 'Engaging content', 'Visual learning', 'Modern approach']
    }
  ]

  const academicExcellence = [
    {
      year: '2024',
      achievement: '100% Board Results',
      description: 'All students passed with distinction in CBSE examinations',
      icon: Award
    },
    {
      year: '2023',
      achievement: 'Academic Excellence Award',
      description: 'Recognition for outstanding academic performance',
      icon: Sparkles
    },
    {
      year: '2022',
      achievement: 'Best School Award',
      description: 'Top performing school in Nashik district',
      icon: GraduationCap
    },
    {
      year: '2021',
      achievement: 'Innovation in Teaching',
      description: 'Excellence in modern teaching methodologies',
      icon: BookOpen
    }
  ]

  const studentSupport = [
    {
      icon: Heart,
      title: 'Counseling Services',
      description: 'Professional counseling for academic and personal development',
      features: ['Career guidance', 'Academic counseling', 'Personal development', 'Parent consultation']
    },
    {
      icon: Brain,
      title: 'Learning Support',
      description: 'Specialized support for students with different learning needs',
      features: ['Individual attention', 'Remedial classes', 'Progress monitoring', 'Customized learning']
    },
    {
      icon: Users,
      title: 'Mentorship Program',
      description: 'One-on-one mentorship with teachers and senior students',
      features: ['Academic mentoring', 'Life skills guidance', 'Goal setting', 'Regular check-ins']
    },
    {
      icon: Dumbbell,
      title: 'Physical Development',
      description: 'Comprehensive physical education and sports programs',
      features: ['Multiple sports', 'Fitness training', 'Health education', 'Competitive events']
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
              Curriculum & Learning
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Discover our comprehensive curriculum that combines traditional academic excellence with innovative teaching methodologies.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Curriculum</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive educational framework that prepares students for the future through innovative learning methods.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {curriculum.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 border border-gray-200 rounded-2xl text-center group hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                <ul className="space-y-3 text-left">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Academic Subjects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive subject offerings with modern teaching methodologies and digital resources.
            </p>
          </motion.div>

          <div className="space-y-16">
            {subjects.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">{category.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((subject, index) => (
                    <motion.div
                      key={subject.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-6 border border-gray-200 rounded-xl text-center group hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                        <subject.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{subject.name}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{subject.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methods */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Innovative Teaching Methods</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern pedagogical approaches that create engaging and effective learning experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {teachingMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 border border-gray-200 rounded-2xl hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{method.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {method.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Academic Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Consistent track record of outstanding academic performance and recognition.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {academicExcellence.map((achievement, index) => (
              <motion.div
                key={achievement.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 border border-gray-200 rounded-2xl text-center group hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                  <achievement.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl font-bold text-primary-600 mb-2">{achievement.year}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.achievement}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Support */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Comprehensive Student Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Holistic support system ensuring every student reaches their full potential.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {studentSupport.map((support, index) => (
              <motion.div
                key={support.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 border border-gray-200 rounded-2xl hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <support.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{support.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{support.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {support.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Experience Quality Education</h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
              Join our innovative academic program and give your child the advantage of quality education. 
              Apply now to secure your child's future.
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
                href="/school-info" 
                className="group bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>View School Information</span>
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
