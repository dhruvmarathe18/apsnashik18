'use client'

import { useMemo } from 'react'
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
  Sparkles,
  ChevronRight,
  PlayCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useData } from '@/contexts/DataContext'
import { useHeroImage } from '@/hooks/useHeroImage'
import { useCloudinaryMedia } from '@/hooks/useCloudinaryMedia'
import CloudinaryImage from '@/components/ui/CloudinaryImage'

export default function Home() {
  const { getUpcomingEvents, getPublishedNews } = useData()
  const { heroImage, heroImageId, loading: heroLoading } = useHeroImage()
  
  // Direct path to hero-main.jpg
  const heroMainPath = 'aps-nashik/hero-images/hero-main'
  
  // Fetch teacher images from Cloudinary
  const { media: teacherMedia } = useCloudinaryMedia({
    folder: 'aps-nashik/teachers',
    maxResults: 10,
  })
  
  // Fetch student images from Cloudinary
  const { media: studentMedia } = useCloudinaryMedia({
    folder: 'aps-nashik/students',
    maxResults: 50,
  })
  
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

  // Use teacher images from Cloudinary
  const teachers = useMemo(() => {
    const baseTeachers = [
      {
        name: 'Mrs. Priya Sharma',
        subject: 'Mathematics',
        experience: '12 years',
        qualification: 'M.Sc. Mathematics, B.Ed'
      },
      {
        name: 'Mr. Rajesh Patel',
        subject: 'Science',
        experience: '15 years',
        qualification: 'M.Sc. Physics, B.Ed'
      },
      {
        name: 'Mrs. Meera Desai',
        subject: 'English',
        experience: '10 years',
        qualification: 'M.A. English, B.Ed'
      },
      {
        name: 'Mr. Amit Kumar',
        subject: 'Social Studies',
        experience: '8 years',
        qualification: 'M.A. History, B.Ed'
      }
    ]
    
    // Map teacher images from Cloudinary
    return baseTeachers.map((teacher, index) => ({
      ...teacher,
      image: teacherMedia[index]?.id || `/images/teacher-${index + 1}.jpg`,
      imageUrl: teacherMedia[index]?.url || null,
    }))
  }, [teacherMedia])

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
        image: '/images/kids.jpg'
      }))
    : fallbackEvents

  // Use student images from Cloudinary for testimonials
  const testimonials = useMemo(() => {
    const baseTestimonials = [
      {
        name: 'Priya Sharma',
        role: 'Parent',
        content: 'My daughter has grown tremendously since joining Apple Public School. The teachers are caring and the academic standards are excellent.',
        rating: 5,
      },
      {
        name: 'Rajesh Patel',
        role: 'Parent',
        content: 'The school provides a perfect balance of academics and extracurricular activities. My son loves coming to school every day.',
        rating: 5,
      },
      {
        name: 'Meera Desai',
        role: 'Parent',
        content: 'Excellent infrastructure and dedicated teachers. The school focuses on overall development of children.',
        rating: 5,
      }
    ]
    
    // Map student images to testimonials
    return baseTestimonials.map((testimonial, index) => ({
      ...testimonial,
      image: studentMedia[index]?.id || 'aps-nashik/students',
      imageUrl: studentMedia[index]?.url || null,
    }))
  }, [studentMedia])

  // Use student images from Cloudinary for events
  const eventsWithStudentImages = useMemo(() => {
    return events.map((event, index) => {
      // Use student images from Cloudinary, cycling through them
      const studentImageIndex = index % (studentMedia.length || 1)
      const studentImage = studentMedia[studentImageIndex]
      
      return {
        ...event,
        image: studentImage?.id || event.image || 'aps-nashik/students',
        imageUrl: studentImage?.url || null,
      }
    })
  }, [events, studentMedia])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Modern Hero Section - Inspired by ASB */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Background Image from Cloudinary - Using hero-main.jpg */}
        <div className="absolute inset-0 z-0">
          <CloudinaryImage
            src={heroImageId || heroMainPath}
            alt="Apple Public School Nashik"
            fill
            className="object-cover"
            sizes="100vw"
            cloudinaryOptions={{
              quality: 'auto',
              format: 'auto',
              effect: 'brightness:1.1,contrast:1.1,saturation:1.1',
            }}
            fallbackSrc={heroImage || undefined}
          />
          {/* Light gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/25"></div>
          {/* Subtle color tint for warmth */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/15 via-transparent to-primary-700/20"></div>
        </div>
        
        {/* Background Pattern Overlay - very subtle */}
        <div className="absolute inset-0 opacity-[0.03] z-[1]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
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
                className="inline-flex items-center justify-center w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl mb-6 ring-4 ring-white/20"
              >
                <GraduationCap className="w-10 h-10 text-primary-600" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
              >
                We inspire all of our students to{' '}
                <span className="text-yellow-300 drop-shadow-lg">continuous inquiry</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-xl font-medium"
              >
                Empowering them with the skills, courage, optimism, and integrity to pursue their dreams and enhance the lives of others.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link 
                  href="/contact" 
                  className="group bg-white hover:bg-yellow-50 text-primary-700 font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center space-x-2 border-2 border-white/20 backdrop-blur-sm"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/about" 
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center space-x-2 shadow-xl"
                >
                  <span>Discover Our School</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Key Values Section - Inspired by ASB */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Exceptional Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Students are empowered by dreams, and they are equipped with skills to become life-long learners.
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

      {/* Stats Section - Modern Design */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-primary-100 text-lg font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Modern Layout */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <CloudinaryImage
                  src="aps-nashik/gallery/classroom-activities"
                  alt="Students at Apple Public School"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  cloudinaryOptions={{
                    quality: 'auto',
                    format: 'auto',
                  }}
                  fallbackSrc="/images/kids.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About Our School
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Apple Public School has been providing quality education since 2009. We are committed to academic excellence and character development, 
                creating a nurturing environment where every child can thrive and reach their full potential.
              </p>
              <div className="space-y-4 mb-8">
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
              <Link href="/about" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold text-lg group">
                <span>Learn More About Us</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teachers Section - Modern Card Design */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Remarkable Educators</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our dedicated team of experienced educators who are committed to nurturing every child's potential.
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
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <CloudinaryImage
                    src={teacher.image || 'aps-nashik/teachers'}
                    alt={teacher.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    cloudinaryOptions={{
                      width: 400,
                      height: 400,
                      crop: 'fill',
                      quality: 'auto',
                    }}
                    fallbackSrc={teacher.imageUrl || `/images/teacher-${index + 1}.jpg`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</h3>
                  <p className="text-primary-600 font-semibold mb-2">{teacher.subject}</p>
                  <p className="text-sm text-gray-600 mb-1">{teacher.qualification}</p>
                  <p className="text-sm text-gray-500">{teacher.experience} experience</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section - Modern Design */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">School Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with our latest school events, activities, and celebrations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsWithStudentImages.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <CloudinaryImage
                    src={event.image || 'aps-nashik/students'}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    cloudinaryOptions={{
                      width: 800,
                      height: 600,
                      crop: 'fill',
                      quality: 'auto',
                    }}
                    fallbackSrc={event.imageUrl || '/images/kids.jpg'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                  <Link href="/gallery" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold group">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Parents Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-2 ring-primary-100">
                    <CloudinaryImage
                      src={testimonial.image || 'aps-nashik/students'}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      cloudinaryOptions={{
                        width: 64,
                        height: 64,
                        crop: 'fill',
                        quality: 'auto',
                      }}
                      fallbackSrc={testimonial.imageUrl || '/images/kids.jpg'}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Design */}
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
              Ready to Join Our School?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
              Give your child the best start in life with quality education and holistic development at Apple Public School.
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
                href="/about" 
                className="group bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Learn More About Us</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
