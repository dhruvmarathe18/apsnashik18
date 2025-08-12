'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  Cpu, 
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
  Heart
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
        { name: 'Physical Education', icon: Cpu, description: 'Sports activities and physical fitness development' },
        { name: 'Arts & Crafts', icon: BarChart3, description: 'Creative expression and artistic skills development' },
        { name: 'Music & Dance', icon: Zap, description: 'Cultural activities and performing arts' }
      ]
    },
    {
      category: 'Life Skills',
      items: [
        { name: 'Communication', icon: Palette, description: 'Effective communication and presentation skills' },
        { name: 'Leadership', icon: Music, description: 'Leadership qualities and team management skills' },
        { name: 'Critical Thinking', icon: Users, description: 'Analytical thinking and problem-solving abilities' },
        { name: 'Values Education', icon: Lightbulb, description: 'Moral values and ethical decision making' }
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
      icon: Cpu
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
      features: ['Individual attention', 'Remedial classes', 'AI-assisted learning', 'Progress monitoring']
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
            <GraduationCap className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="heading-primary mb-4"
          >
            AI-Enhanced Academic Excellence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Discover our innovative curriculum that combines traditional academic excellence with cutting-edge AI technology.
          </motion.p>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Our AI-Enhanced Curriculum</h2>
            <p className="text-body max-w-3xl mx-auto">
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
                className="card p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-4">{item.title}</h3>
                <p className="text-dark-600 mb-6">{item.description}</p>
                <ul className="space-y-2 text-left">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-dark-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Academic Subjects</h2>
            <p className="text-body max-w-3xl mx-auto">
              Comprehensive subject offerings enhanced with AI technology and modern teaching methodologies.
            </p>
          </motion.div>

          <div className="space-y-12">
            {subjects.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-dark-900 mb-8 text-center">{category.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((subject, index) => (
                    <motion.div
                      key={subject.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <subject.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-dark-900 mb-2">{subject.name}</h4>
                      <p className="text-sm text-dark-600">{subject.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methods */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Innovative Teaching Methods</h2>
            <p className="text-body max-w-3xl mx-auto">
              Modern pedagogical approaches that leverage technology to create engaging and effective learning experiences.
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
                className="card p-8"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">{method.title}</h3>
                    <p className="text-dark-600">{method.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {method.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-dark-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Academic Excellence</h2>
            <p className="text-body max-w-3xl mx-auto">
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
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-2">{achievement.year}</div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{achievement.achievement}</h3>
                <p className="text-sm text-dark-600">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Support */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Comprehensive Student Support</h2>
            <p className="text-body max-w-3xl mx-auto">
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
                className="card p-8"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <support.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">{support.title}</h3>
                    <p className="text-dark-600">{support.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {support.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-dark-600">{feature}</span>
                    </li>
                  ))}
                </ul>
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
            <h2 className="heading-secondary text-white mb-4">Experience AI-Enhanced Education</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join our innovative academic program and give your child the advantage of AI-powered learning. 
              Apply now to secure your child's future in education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Apply for Admission
              </Link>
              <Link href="/school-info" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                View School Information
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
